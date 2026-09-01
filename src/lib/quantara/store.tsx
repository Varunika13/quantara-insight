import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { calculatePortfolioRisk } from "./engine";
import { STOCK_REGISTRY } from "./registry";
import type { AnalysisSession, Holding, PortfolioRisk, RiskProfile } from "./types";

interface PersistShape {
  watchlist: string[];
  holdings: Holding[];
  profile: RiskProfile;
  selected: string;
  sessions: AnalysisSession[];
  views: Record<string, number>;
}

const KEY = "quantara-state-v1";

const DEFAULTS: PersistShape = {
  watchlist: ["RELIANCE", "SUNPHARMA", "SBIN", "ICICIBANK"],
  holdings: [
    { id: "h1", symbol: "RELIANCE", shares: 40, avg_price: 2710 },
    { id: "h2", symbol: "HDFCBANK", shares: 60, avg_price: 1580 },
    { id: "h3", symbol: "INFY", shares: 25, avg_price: 1495 },
  ],
  profile: "Moderate",
  selected: "RELIANCE",
  sessions: [],
  views: { RELIANCE: 3, SUNPHARMA: 2, TCS: 1 },
};

interface Ctx extends PersistShape {
  portfolio: PortfolioRisk;
  setProfile: (p: RiskProfile) => void;
  setSelected: (s: string) => void;
  addToWatchlist: (s: string) => void;
  removeFromWatchlist: (s: string) => void;
  addHolding: (h: Omit<Holding, "id">) => void;
  removeHolding: (id: string) => void;
  logSession: (s: AnalysisSession) => void;
  latestFor: (symbol: string) => AnalysisSession | undefined;
}

const QuantaraContext = createContext<Ctx | null>(null);

/** Mock seed sessions so History and Metrics are populated for the demo. */
function seedSessions(): AnalysisSession[] {
  const base = [
    { symbol: "RELIANCE", rec: "Bullish", conf: 78, profile: "Moderate", conflict: false, degraded: false, ret: 4.8 },
    { symbol: "SBIN", rec: "Bearish", conf: 71, profile: "Conservative", conflict: true, degraded: false, ret: -3.4 },
    { symbol: "SUNPHARMA", rec: "Bullish", conf: 82, profile: "Aggressive", conflict: false, degraded: false, ret: 6.2 },
    { symbol: "ADANIPORTS", rec: "Cautious Opportunity", conf: 54, profile: "Moderate", conflict: true, degraded: true, ret: 1.9 },
    { symbol: "MARUTI", rec: "Neutral", conf: 61, profile: "Conservative", conflict: true, degraded: false, ret: -1.2 },
  ] as const;
  return base.map((b, i) => {
    const stock = STOCK_REGISTRY.find((s) => s.symbol === b.symbol)!;
    return {
      id: `QS-${b.symbol}-DEMO${i + 1}`,
      created_at: new Date(Date.UTC(2026, 7, 24 + i, 10, 15)).toISOString(),
      symbol: b.symbol,
      company_name: stock.company_name,
      risk_profile: b.profile as RiskProfile,
      signals: [],
      agents: [],
      synthesis: {
        agent_name: "QUANTARA Synthesis Agent",
        recommendation: b.rec as AnalysisSession["synthesis"]["recommendation"],
        confidence: b.conf,
        summary: `Archived demo session for ${stock.company_name}. Re-run the analysis on the Dashboard for the full reasoning trace.`,
        risk_profile_explanation: `Recorded under a ${b.profile} risk profile.`,
        reasoning_trace_summary: "Fundamentals · Technical · Sentiment → Synthesis",
        what_would_change_this: "New filings or a decisive change in momentum could shift this archived call.",
        sources: [],
        perspectives: { Conservative: "", Moderate: "", Aggressive: "" },
        decision: {
          stock_symbol: b.symbol,
          final_verdict: (b.rec === "Bullish" ? "BUY" : b.rec === "Bearish" ? "AVOID" : "HOLD") as "BUY" | "HOLD" | "AVOID",
          confidence: b.conflict ? Math.max(0, b.conf - 12) : b.conf,
          justification: `Archived demo decision for ${stock.company_name}. Re-run the analysis on the Dashboard for the full agent-weighted justification.`,
          agent_agreement: (b.conflict ? "Conflicting" : "Full Agreement") as "Full Agreement" | "Partial Agreement" | "Conflicting",
          contributing_agents: b.conflict ? ["Fundamentals Agent"] : ["Fundamentals Agent", "Technical Agent"],
          cited_sources: ["Archived demo filing extract"],
          risk_flags: [
            ...(b.conflict ? ["Agents returned directly conflicting verdicts"] : []),
            ...(b.degraded ? ["Partial data coverage — confidence reduced"] : []),
          ],
          disclaimer:
            "This is an AI-generated research aid, not financial advice. Past performance and model outputs do not guarantee future results.",
        },
        latency_ms: 340,
      },
      conflict: b.conflict ? { agents: ["Technical Agent", "Fundamentals Agent"], message: "Archived session recorded conflicting agent verdicts." } : null,
      health: { technical: true, fundamentals: !b.degraded, sentiment: true, degraded: b.degraded },
      total_latency_ms: 900 + i * 120,
      sources_cited: b.degraded ? 2 : 5,
      mock_forward_return: b.ret,
      accuracy_placeholder:
        b.rec === "Neutral" ? "Neutral Call" : (b.rec === "Bearish") === b.ret < 0 ? "Matched Direction" : "Missed Direction",
      portfolio_concentration: 42,
    } satisfies AnalysisSession;
  });
}

export function QuantaraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistShape>(() => ({ ...DEFAULTS, sessions: seedSessions() }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((prev) => ({ ...prev, ...(JSON.parse(raw) as PersistShape) }));
    } catch {
      /* ignore corrupt local state */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const patch = useCallback((p: Partial<PersistShape>) => setState((s) => ({ ...s, ...p })), []);

  const value = useMemo<Ctx>(() => {
    const portfolio = calculatePortfolioRisk(state.holdings);
    return {
      ...state,
      portfolio,
      setProfile: (profile) => patch({ profile }),
      setSelected: (selected) =>
        setState((s) => ({ ...s, selected, views: { ...s.views, [selected]: (s.views[selected] ?? 0) + 1 } })),
      addToWatchlist: (sym) => setState((s) => (s.watchlist.includes(sym) ? s : { ...s, watchlist: [...s.watchlist, sym] })),
      removeFromWatchlist: (sym) => setState((s) => ({ ...s, watchlist: s.watchlist.filter((w) => w !== sym) })),
      addHolding: (h) => setState((s) => ({ ...s, holdings: [...s.holdings, { ...h, id: `h${Date.now()}` }] })),
      removeHolding: (id) => setState((s) => ({ ...s, holdings: s.holdings.filter((h) => h.id !== id) })),
      logSession: (session) => setState((s) => ({ ...s, sessions: [session, ...s.sessions].slice(0, 40) })),
      latestFor: (symbol) => state.sessions.find((x) => x.symbol === symbol),
    };
  }, [state, patch]);

  return <QuantaraContext.Provider value={value}>{children}</QuantaraContext.Provider>;
}

export function useQuantara() {
  const ctx = useContext(QuantaraContext);
  if (!ctx) throw new Error("useQuantara must be used inside QuantaraProvider");
  return ctx;
}
