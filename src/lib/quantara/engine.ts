import { getDocumentsForStock, getStockData } from "./registry";
import type {
  AgentOutput,
  AgentSource,
  AnalysisSession,
  Classification,
  Conflict,
  DataHealth,
  Holding,
  PortfolioRisk,
  RiskProfile,
  Signal,
  Stock,
  SynthesisOutput,
} from "./types";

/* ────────────────── signal classification ────────────────── */

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(n)));

export function computePriceMomentumSignal(stock: Stock): Signal {
  const h = stock.price_history;
  const last = h[h.length - 1]!.close;
  const sma10 = h.slice(-10).reduce((a, b) => a + b.close, 0) / Math.min(10, h.length);
  const change30 = ((last - h[0]!.close) / h[0]!.close) * 100;
  const aboveSma = ((last - sma10) / sma10) * 100;
  const score = change30 * 0.7 + aboveSma * 2 + stock.daily_change_percent * 0.6;
  const classification: Classification = score > 2 ? "Bullish" : score < -2 ? "Bearish" : "Neutral";
  const confidence = clamp(52 + Math.min(38, Math.abs(score) * 4));
  const dir = classification === "Bullish" ? "above" : classification === "Bearish" ? "below" : "close to";
  return {
    signal_type: "Price Momentum",
    classification,
    confidence,
    reasoning: `Price is ${dir} the 10-day average (${aboveSma.toFixed(1)}%) with a ${change30.toFixed(1)}% move over the last 30 sessions and ${stock.daily_change_percent.toFixed(2)}% today.`,
    source: "30-Day Price History",
  };
}

export function computeVolumeAnomalySignal(stock: Stock): Signal {
  const vc = stock.volume_change_percent;
  const aligned = Math.sign(stock.daily_change_percent) || 1;
  const magnitude = Math.abs(vc);
  let classification: Classification = "Neutral";
  if (magnitude >= 25) classification = aligned > 0 ? "Bullish" : "Bearish";
  const confidence = clamp(50 + Math.min(40, magnitude * 0.55));
  return {
    signal_type: "Volume Anomaly",
    classification,
    confidence,
    reasoning:
      magnitude >= 25
        ? `Trading volume is ${vc > 0 ? "up" : "down"} ${magnitude.toFixed(1)}% versus its recent average, ${aligned > 0 ? "confirming" : "accompanying"} today's ${stock.daily_change_percent.toFixed(2)}% price move.`
        : `Trading activity remains close to the recent average (${vc.toFixed(1)}% change), showing no meaningful anomaly.`,
    source: "Trading Volume + Volume Change",
  };
}

export function computeSentimentSignal(stock: Stock): Signal {
  const feed = stock.sentiment_feed;
  if (!feed.length) {
    return {
      signal_type: "Sentiment",
      classification: "Neutral",
      confidence: 0,
      reasoning: "No sentiment items are available for this stock in the demo feed, so no sentiment view is asserted.",
      source: "Demo Sentiment Feed (unavailable)",
    };
  }
  const avg = feed.reduce((a, b) => a + b.score, 0) / feed.length;
  const pos = feed.filter((f) => f.sentiment === "Positive").length;
  const neg = feed.filter((f) => f.sentiment === "Negative").length;
  const classification: Classification = avg > 12 ? "Bullish" : avg < -12 ? "Bearish" : "Neutral";
  return {
    signal_type: "Sentiment",
    classification,
    confidence: clamp(50 + Math.min(40, Math.abs(avg) * 0.55)),
    reasoning: `Across ${feed.length} demo headlines, ${pos} are positive and ${neg} negative (average score ${avg.toFixed(0)}), indicating ${classification.toLowerCase()} coverage.`,
    source: "Demo Sentiment Feed",
  };
}

/* ────────────────── retrieval (keyword relevance) ────────────────── */

const STOP = new Set(["the", "and", "for", "with", "from", "this", "that", "into", "over", "under", "a", "of", "in", "on", "to", "is"]);

export interface Retrieved extends AgentSource {
  document_id: string;
  chunk_id: string;
}

export function retrieveDocuments(symbol: string, query: string, k = 3): Retrieved[] {
  const docs = getDocumentsForStock(symbol);
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
  const scored: Retrieved[] = [];
  for (const doc of docs) {
    for (const chunk of doc.chunks) {
      const text = chunk.text.toLowerCase();
      let score = 0;
      for (const t of terms) if (text.includes(t)) score += 1;
      if (score === 0) continue;
      scored.push({
        document_id: doc.document_id,
        chunk_id: chunk.chunk_id,
        document: doc.document_title,
        type: doc.document_type,
        snippet: chunk.text,
        relevance: Math.round((score / terms.length) * 100),
      });
    }
  }
  return scored.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)).slice(0, k);
}

/* ────────────────── agents ────────────────── */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const POSITIVE_WORDS = ["growth", "expansion", "improved", "strong", "supported", "healthy", "gains", "recovery"];
const NEGATIVE_WORDS = ["pressure", "risk", "uncertainty", "weakness", "uneven", "cautions", "volatility", "scrutiny"];

export async function analyzeFundamentals(stock: Stock): Promise<AgentOutput> {
  const t0 = Date.now();
  await wait(320 + (stock.symbol.length % 5) * 40);
  const evidence = retrieveDocuments(
    stock.symbol,
    `revenue growth margin expansion risk regulatory outlook ${stock.sector}`,
    3,
  );
  if (!evidence.length) {
    return {
      agent_name: "Fundamentals Agent",
      verdict: "Unavailable",
      confidence: 0,
      reasoning: "No relevant supporting financial document was available for this analysis.",
      sources: [],
      latency_ms: Date.now() - t0,
    };
  }
  let pos = 0;
  let neg = 0;
  for (const e of evidence) {
    const t = e.snippet.toLowerCase();
    POSITIVE_WORDS.forEach((w) => t.includes(w) && pos++);
    NEGATIVE_WORDS.forEach((w) => t.includes(w) && neg++);
  }
  const net = pos - neg;
  const verdict = net >= 2 ? "Bullish" : net <= -2 ? "Bearish" : "Neutral";
  return {
    agent_name: "Fundamentals Agent",
    verdict,
    confidence: clamp(55 + Math.min(30, Math.abs(net) * 6)),
    reasoning: `Retrieved filings and transcripts describe ${pos} growth-oriented and ${neg} risk-oriented statements. The documented mix points to a ${verdict.toLowerCase()} fundamental picture for ${stock.company_name}.`,
    sources: evidence.map(({ document, snippet, type, relevance }) => ({ document, snippet, type, relevance })),
    latency_ms: Date.now() - t0,
  };
}

export async function analyzeTechnical(stock: Stock, signals: Signal[]): Promise<AgentOutput> {
  const t0 = Date.now();
  await wait(210);
  const momentum = signals.find((s) => s.signal_type === "Price Momentum")!;
  const volume = signals.find((s) => s.signal_type === "Volume Anomaly")!;
  const bull = [momentum, volume].filter((s) => s.classification === "Bullish").length;
  const bear = [momentum, volume].filter((s) => s.classification === "Bearish").length;
  const verdict = bull > bear ? "Bullish" : bear > bull ? "Bearish" : "Neutral";
  return {
    agent_name: "Technical Agent",
    verdict,
    confidence: clamp((momentum.confidence + volume.confidence) / 2),
    reasoning: `${momentum.reasoning} ${volume.reasoning}`,
    sources: [
      {
        document: "30-Day Price History + Trading Volume",
        type: "Market Data (Demo)",
        snippet: `Last close ${stock.current_price}, daily change ${stock.daily_change_percent}%, volume ${stock.trading_volume.toLocaleString("en-IN")} (${stock.volume_change_percent}% vs average).`,
      },
    ],
    latency_ms: Date.now() - t0,
  };
}

export async function analyzeSentiment(stock: Stock, signals: Signal[]): Promise<AgentOutput> {
  const t0 = Date.now();
  await wait(260);
  const sig = signals.find((s) => s.signal_type === "Sentiment")!;
  if (!stock.sentiment_feed.length) {
    return {
      agent_name: "Sentiment Agent",
      verdict: "Unavailable",
      confidence: 0,
      reasoning: "The demo sentiment feed returned no items for this stock, so no sentiment verdict is asserted.",
      sources: [],
      latency_ms: Date.now() - t0,
    };
  }
  return {
    agent_name: "Sentiment Agent",
    verdict: sig.classification,
    confidence: sig.confidence,
    reasoning: sig.reasoning,
    sources: stock.sentiment_feed.slice(0, 3).map((f) => ({
      document: `Demo Sentiment Feed — ${f.source_name}`,
      type: f.sentiment,
      snippet: f.headline,
    })),
    latency_ms: Date.now() - t0,
  };
}

/* ────────────────── conflict + health ────────────────── */

export function detectConflict(agents: AgentOutput[]): Conflict | null {
  const valid = agents.filter((a) => a.verdict !== "Unavailable");
  const distinct = new Set(valid.map((a) => a.verdict));
  if (distinct.size < 2) return null;
  const sorted = [...valid].sort((a, b) => b.confidence - a.confidence);
  const a = sorted[0]!;
  const b = sorted.find((x) => x.verdict !== a.verdict)!;
  return {
    agents: valid.map((v) => v.agent_name),
    message: `${a.agent_name} is ${a.verdict} (${a.confidence}%) while ${b.agent_name} is ${b.verdict} (${b.confidence}%). QUANTARA keeps both perspectives visible instead of averaging the disagreement away.`,
  };
}

export function assessDataHealth(stock: Stock): DataHealth {
  const fundamentals = getDocumentsForStock(stock.symbol).length > 0;
  const sentiment = stock.sentiment_feed.length > 0;
  const technical = stock.price_history.length >= 20;
  const degraded = !(fundamentals && sentiment && technical);
  return {
    technical,
    fundamentals,
    sentiment,
    degraded,
    note: degraded
      ? "Live data is temporarily unavailable for part of this stock's coverage. QUANTARA is using available cached or demo data and has reduced confidence accordingly."
      : undefined,
  };
}

/* ────────────────── synthesis ────────────────── */

const PROFILE_TEXT: Record<RiskProfile, (rec: string, sym: string) => string> = {
  Conservative: (rec) =>
    `For your Conservative profile, ${rec.toLowerCase()} signals are present, but current uncertainty suggests caution, position sizing discipline and continued monitoring before increasing exposure. Capital preservation takes priority over chasing the move.`,
  Moderate: (rec) =>
    `For your Moderate profile, the current ${rec.toLowerCase()} signal presents a potential opportunity while maintaining awareness of market risk. A staggered approach with defined review points is consistent with this profile.`,
  Aggressive: (rec) =>
    `For your Aggressive profile, the current ${rec.toLowerCase()} signals may support stronger consideration, while volatility and market conditions should continue to be monitored and risk limits respected.`,
};

export async function synthesizeRecommendation(
  stock: Stock,
  signals: Signal[],
  agents: AgentOutput[],
  profile: RiskProfile,
  conflict: Conflict | null,
  health: DataHealth,
  portfolio?: PortfolioRisk,
): Promise<SynthesisOutput> {
  const t0 = Date.now();
  await wait(340);
  const valid = agents.filter((a) => a.verdict !== "Unavailable");
  const score = valid.reduce(
    (acc, a) => acc + (a.verdict === "Bullish" ? 1 : a.verdict === "Bearish" ? -1 : 0) * (a.confidence / 100),
    0,
  );
  let recommendation: SynthesisOutput["recommendation"] =
    score > 0.9 ? "Bullish" : score < -0.9 ? "Bearish" : score > 0.25 ? "Cautious Opportunity" : "Neutral";
  if (profile === "Conservative" && recommendation === "Bullish" && conflict) recommendation = "Cautious Opportunity";

  let confidence = clamp(valid.length ? valid.reduce((a, b) => a + b.confidence, 0) / valid.length : 0);
  if (conflict) confidence = clamp(confidence - 10);
  if (health.degraded) confidence = clamp(confidence - 12);
  if (profile === "Conservative") confidence = clamp(confidence - 5);
  if (profile === "Aggressive") confidence = clamp(confidence + 3);

  const holdingWeight = portfolio?.rows.find((r) => r.symbol === stock.symbol)?.allocation ?? 0;
  const portfolioNote = holdingWeight
    ? ` This stock already represents ${holdingWeight.toFixed(1)}% of your portfolio, so incremental exposure would increase concentration.`
    : "";

  const sources = agents.flatMap((a) => a.sources);

  return {
    agent_name: "QUANTARA Synthesis Agent",
    recommendation,
    confidence,
    summary: `${valid.length} of ${agents.length} agents returned a verdict for ${stock.company_name} (${stock.symbol}). Combining documented fundamentals, price and volume behaviour and demo news sentiment, QUANTARA reads the current picture as ${recommendation}.${portfolioNote}`,
    risk_profile_explanation: PROFILE_TEXT[profile](recommendation, stock.symbol),
    reasoning_trace_summary: agents
      .map((a) => `${a.agent_name}: ${a.verdict}${a.verdict === "Unavailable" ? "" : ` (${a.confidence}%)`}`)
      .join(" · "),
    what_would_change_this:
      recommendation === "Bearish"
        ? "A recovery in momentum with volume confirmation, alongside fresh filings showing margin stabilisation, could shift this analysis toward a more constructive stance."
        : "A sustained decline in momentum combined with negative earnings evidence or a clear deterioration in news sentiment could shift this analysis toward a more cautious stance.",
    sources,
    perspectives: {
      Conservative: PROFILE_TEXT.Conservative(recommendation, stock.symbol),
      Moderate: PROFILE_TEXT.Moderate(recommendation, stock.symbol),
      Aggressive: PROFILE_TEXT.Aggressive(recommendation, stock.symbol),
    },
    latency_ms: Date.now() - t0,
  };
}

/* ────────────────── portfolio ────────────────── */

export function calculatePortfolioRisk(holdings: Holding[]): PortfolioRisk {
  const rows = holdings
    .map((h) => {
      const s = getStockData(h.symbol);
      if (!s) return null;
      const value = s.current_price * h.shares;
      return {
        symbol: s.symbol,
        company_name: s.company_name,
        shares: h.shares,
        avg_price: h.avg_price,
        current_price: s.current_price,
        value,
        allocation: 0,
        pnl_percent: ((s.current_price - h.avg_price) / h.avg_price) * 100,
      };
    })
    .filter(Boolean) as PortfolioRisk["rows"];

  const total_value = rows.reduce((a, b) => a + b.value, 0);
  const total_cost = holdings.reduce((a, h) => {
    const s = getStockData(h.symbol);
    return s ? a + h.avg_price * h.shares : a;
  }, 0);
  rows.forEach((r) => (r.allocation = total_value ? (r.value / total_value) * 100 : 0));
  const hhi = rows.reduce((a, r) => a + Math.pow(r.allocation / 100, 2), 0);
  const score = rows.length ? clamp(hhi * 100) : 0;
  return {
    total_value,
    total_cost,
    score,
    band: score >= 55 ? "High" : score >= 30 ? "Moderate" : "Low",
    top_weight: rows.reduce((a, r) => Math.max(a, r.allocation), 0),
    rows: rows.sort((a, b) => b.value - a.value),
  };
}

/* ────────────────── pipeline ────────────────── */

export async function runAnalysis(
  stock: Stock,
  profile: RiskProfile,
  portfolio?: PortfolioRisk,
): Promise<AnalysisSession> {
  const started = Date.now();
  const signals = [computePriceMomentumSignal(stock), computeVolumeAnomalySignal(stock), computeSentimentSignal(stock)];
  const health = assessDataHealth(stock);

  // Specialized agents run in parallel.
  const agents = await Promise.all([
    analyzeFundamentals(stock),
    analyzeTechnical(stock, signals),
    analyzeSentiment(stock, signals),
  ]);

  const conflict = detectConflict(agents);
  const synthesis = await synthesizeRecommendation(stock, signals, agents, profile, conflict, health, portfolio);
  const total = Date.now() - started;

  const h = stock.price_history;
  const drift = ((h[h.length - 1]!.close - h[0]!.close) / h[0]!.close) * 100;
  const mock_forward_return = Number((drift * 0.6 + stock.daily_change_percent * 1.4).toFixed(1));
  const dirRec = synthesis.recommendation === "Bearish" ? -1 : synthesis.recommendation === "Neutral" ? 0 : 1;
  const accuracy: AnalysisSession["accuracy_placeholder"] =
    dirRec === 0 ? "Neutral Call" : Math.sign(mock_forward_return) === dirRec ? "Matched Direction" : "Missed Direction";

  return {
    id: `QS-${stock.symbol}-${started.toString().slice(-6)}`,
    created_at: new Date().toISOString(),
    symbol: stock.symbol,
    company_name: stock.company_name,
    risk_profile: profile,
    signals,
    agents,
    synthesis,
    conflict,
    health,
    total_latency_ms: total,
    sources_cited: synthesis.sources.length,
    mock_forward_return,
    accuracy_placeholder: accuracy,
    portfolio_concentration: portfolio?.score ?? 0,
  };
}

/* ────────────────── Ask Quantara ────────────────── */

export function askQuantara(
  question: string,
  session: AnalysisSession | null,
  profile: RiskProfile,
  portfolio: PortfolioRisk,
): string {
  if (!session) {
    return "Run 'Generate QUANTARA Intelligence' on a stock first — I answer only from agent outputs, retrieved sources and your profile for the current analysis.";
  }
  const q = question.toLowerCase();
  const agent = session.agents.find((a) => q.includes(a.agent_name.split(" ")[0]!.toLowerCase()));
  if (agent) {
    const src = agent.sources[0];
    return `${agent.agent_name} is ${agent.verdict}${agent.verdict === "Unavailable" ? "" : ` at ${agent.confidence}% confidence`}. ${agent.reasoning}${src ? `\n\nSource — ${src.document}: "${src.snippet}"` : "\n\nNo sources were retrieved for this agent."}`;
  }
  if (q.includes("portfolio") || q.includes("holding")) {
    const row = portfolio.rows.find((r) => r.symbol === session.symbol);
    return `Your portfolio concentration score is ${portfolio.score}/100 (${portfolio.band}). ${row ? `${session.symbol} is ${row.allocation.toFixed(1)}% of your holdings, so adding more increases concentration risk.` : `${session.symbol} is not currently in your holdings, so a new position would add a fresh exposure line.`} ${session.synthesis.risk_profile_explanation}`;
  }
  if (q.includes("risk") || q.includes("profile") || q.includes(profile.toLowerCase())) {
    return `${session.synthesis.risk_profile_explanation}\n\nWhat would change this: ${session.synthesis.what_would_change_this}`;
  }
  if (q.includes("source") || q.includes("evidence") || q.includes("cited")) {
    const s = session.synthesis.sources.slice(0, 3);
    return s.length
      ? s.map((x) => `• ${x.document}: "${x.snippet}"`).join("\n")
      : "No documents were retrieved for this analysis, so no evidence is cited.";
  }
  if (q.includes("conflict") || q.includes("disagree")) {
    return session.conflict ? session.conflict.message : "The agents did not materially disagree in this analysis.";
  }
  if (q.includes("signal") || q.includes("momentum") || q.includes("volume") || q.includes("sentiment")) {
    return session.signals.map((s) => `${s.signal_type}: ${s.classification} (${s.confidence}%) — ${s.reasoning}`).join("\n\n");
  }
  return `${session.synthesis.summary}\n\n${session.synthesis.reasoning_trace_summary}\n\nWhat would change this: ${session.synthesis.what_would_change_this}\n\nI answer only from this analysis — agent outputs, retrieved demo documents and your ${profile} profile.`;
}
