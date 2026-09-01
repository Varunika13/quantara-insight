import type { Stock, StockDocument, SentimentItem } from "./types";

/**
 * Scalable stock registry — the single source of truth.
 * Add a new entry to SEEDS and every downstream module (selector, signals,
 * RAG, agents, watchlist, portfolio, charts) picks it up with no code change.
 * All market data below is DEMO / MOCK data.
 */

interface Seed {
  symbol: string;
  company_name: string;
  sector: string;
  price: number;
  change: number;
  volume: number;
  volume_change: number;
  trend: number; // 30-day drift in %
  vol: number; // daily volatility %
  tone: number; // -1..1 sentiment tilt
  themes: { growth: string; risk: string };
  missing_docs?: boolean;
  missing_sentiment?: boolean;
}

const SEEDS: Seed[] = [
  {
    symbol: "RELIANCE",
    company_name: "Reliance Industries Ltd.",
    sector: "Energy / Conglomerate",
    price: 2984.6,
    change: 1.42,
    volume: 8_940_000,
    volume_change: 26.4,
    trend: 6.1,
    vol: 1.1,
    tone: 0.55,
    themes: {
      growth: "retail footprint expansion and digital services subscriber additions",
      risk: "refining margin volatility and elevated capital expenditure",
    },
  },
  {
    symbol: "TCS",
    company_name: "Tata Consultancy Services Ltd.",
    sector: "Technology",
    price: 4126.35,
    change: -0.64,
    volume: 2_310_000,
    volume_change: -12.8,
    trend: -2.4,
    vol: 0.9,
    tone: 0.05,
    themes: {
      growth: "large deal wins across BFSI and cloud modernisation",
      risk: "discretionary spending softness in western markets",
    },
  },
  {
    symbol: "INFY",
    company_name: "Infosys Ltd.",
    sector: "Technology",
    price: 1642.8,
    change: 0.88,
    volume: 6_120_000,
    volume_change: 41.5,
    trend: 4.3,
    vol: 1.2,
    tone: 0.3,
    themes: {
      growth: "AI-led services pipeline and improving utilisation",
      risk: "pricing pressure and wage revision impact on margins",
    },
  },
  {
    symbol: "HDFCBANK",
    company_name: "HDFC Bank Ltd.",
    sector: "Banking",
    price: 1712.45,
    change: 0.34,
    volume: 11_480_000,
    volume_change: 4.1,
    trend: 1.2,
    vol: 0.8,
    tone: 0.12,
    themes: {
      growth: "deposit mobilisation and branch productivity gains",
      risk: "cost of funds pressure and merger integration overhang",
    },
  },
  {
    symbol: "ICICIBANK",
    company_name: "ICICI Bank Ltd.",
    sector: "Banking",
    price: 1188.9,
    change: 1.05,
    volume: 9_260_000,
    volume_change: 18.9,
    trend: 5.4,
    vol: 0.9,
    tone: 0.4,
    themes: {
      growth: "retail loan growth with stable asset quality",
      risk: "unsecured lending scrutiny from the regulator",
    },
  },
  {
    symbol: "SBIN",
    company_name: "State Bank of India",
    sector: "Banking",
    price: 812.15,
    change: -1.28,
    volume: 14_700_000,
    volume_change: 63.2,
    trend: -5.8,
    vol: 1.4,
    tone: -0.45,
    themes: {
      growth: "corporate credit revival and treasury gains",
      risk: "provisioning requirements and slippage in agri portfolios",
    },
  },
  {
    symbol: "ITC",
    company_name: "ITC Ltd.",
    sector: "Consumer",
    price: 448.7,
    change: 0.22,
    volume: 10_050_000,
    volume_change: -3.4,
    trend: 0.6,
    vol: 0.7,
    tone: 0.0,
    themes: {
      growth: "premium packaged foods and hotels demand",
      risk: "taxation uncertainty in the cigarettes business",
    },
  },
  {
    symbol: "HINDUNILVR",
    company_name: "Hindustan Unilever Ltd.",
    sector: "FMCG",
    price: 2385.5,
    change: -0.41,
    volume: 1_840_000,
    volume_change: -22.6,
    trend: -3.2,
    vol: 0.6,
    tone: -0.2,
    themes: {
      growth: "rural demand recovery and premiumisation",
      risk: "input cost inflation and intense competitive intensity",
    },
  },
  {
    symbol: "SUNPHARMA",
    company_name: "Sun Pharmaceutical Industries Ltd.",
    sector: "Healthcare",
    price: 1756.2,
    change: 2.05,
    volume: 3_410_000,
    volume_change: 74.8,
    trend: 8.4,
    vol: 1.3,
    tone: 0.6,
    themes: {
      growth: "specialty portfolio ramp-up in global markets",
      risk: "regulatory inspection outcomes at manufacturing sites",
    },
  },
  {
    symbol: "MARUTI",
    company_name: "Maruti Suzuki India Ltd.",
    sector: "Automotive",
    price: 12480.0,
    change: -1.86,
    volume: 986_000,
    volume_change: 31.7,
    trend: -6.9,
    vol: 1.5,
    tone: -0.55,
    themes: {
      growth: "SUV mix improvement and export volumes",
      risk: "entry-level demand weakness and commodity cost swings",
    },
  },
  {
    symbol: "LT",
    company_name: "Larsen & Toubro Ltd.",
    sector: "Infrastructure",
    price: 3564.9,
    change: 0.94,
    volume: 2_120_000,
    volume_change: 9.2,
    trend: 3.1,
    vol: 1.0,
    tone: 0.35,
    themes: {
      growth: "record order book across infrastructure and energy",
      risk: "execution timelines and working capital intensity",
    },
    missing_sentiment: true,
  },
  {
    symbol: "ADANIPORTS",
    company_name: "Adani Ports & SEZ Ltd.",
    sector: "Logistics",
    price: 1345.75,
    change: 1.63,
    volume: 5_640_000,
    volume_change: 52.3,
    trend: 4.9,
    vol: 1.6,
    tone: 0.1,
    themes: {
      growth: "cargo volume growth and new terminal concessions",
      risk: "leverage levels and governance perception",
    },
    missing_docs: true,
  },
];

/** Deterministic PRNG so SSR and client render identical demo data. */
function rng(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

const DAY = 86_400_000;
const BASE_DATE = Date.UTC(2026, 7, 31);

function buildHistory(seed: Seed) {
  const rand = rng(seed.symbol + "px");
  const start = seed.price / (1 + seed.trend / 100);
  const out: { date: string; close: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const drift = start + (seed.price - start) * t;
    const wobble = (rand() - 0.5) * 2 * seed.vol * 0.01 * drift * (i === 29 ? 0 : 1);
    const wave = Math.sin(i / 3.2 + seed.price) * seed.vol * 0.004 * drift;
    out.push({
      date: new Date(BASE_DATE - (29 - i) * DAY).toISOString().slice(0, 10),
      close: Number((i === 29 ? seed.price : drift + wobble + wave).toFixed(2)),
    });
  }
  return out;
}

const POS = [
  "{c} reports stronger-than-expected quarterly execution",
  "Analysts turn constructive on {c} on {g}",
  "{c} announces capacity expansion in the {s} segment",
  "Institutional buying interest picks up in {c}",
];
const NEG = [
  "{c} flags near-term pressure from {r}",
  "Brokerage trims target on {c} citing {r}",
  "{s} demand indicators soften, weighing on {c}",
  "Profit booking seen in {c} after recent run-up",
];
const NEU = [
  "{c} management to hold investor call next week",
  "{s} sector outlook stays mixed, {c} in focus",
  "{c} completes routine board reshuffle",
];

function buildSentiment(seed: Seed): SentimentItem[] {
  if (seed.missing_sentiment) return [];
  const rand = rng(seed.symbol + "snt");
  const items: SentimentItem[] = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const roll = rand() + seed.tone * 0.45;
    const bucket = roll > 0.62 ? "Positive" : roll < 0.35 ? "Negative" : "Neutral";
    const pool = bucket === "Positive" ? POS : bucket === "Negative" ? NEG : NEU;
    const tpl = pool[Math.floor(rand() * pool.length) % pool.length]!;
    items.push({
      headline: tpl
        .replace("{c}", seed.company_name.replace(/ Ltd\.$/, ""))
        .replace("{s}", seed.sector.split(" ")[0]!)
        .replace("{g}", seed.themes.growth)
        .replace("{r}", seed.themes.risk),
      sentiment: bucket as SentimentItem["sentiment"],
      score: bucket === "Positive" ? 45 + Math.round(rand() * 45) : bucket === "Negative" ? -45 - Math.round(rand() * 40) : Math.round((rand() - 0.5) * 20),
      timestamp: new Date(BASE_DATE - i * DAY * 0.7).toISOString(),
      source_name: ["Demo Market Wire", "Demo Business Daily", "Demo Exchange Feed"][i % 3]!,
    });
  }
  return items;
}

function buildDocuments(seed: Seed): StockDocument[] {
  if (seed.missing_docs) return [];
  const c = seed.company_name.replace(/ Ltd\.$/, "");
  const defs = [
    {
      type: "Demo Earnings Transcript",
      title: `Demo Q2 FY26 Earnings Call Transcript — ${c}`,
      date: "2026-07-24",
      paras: [
        `Fictional Demo Document. Management of ${c} reported revenue growth in the ${seed.sector} business supported by ${seed.themes.growth}.`,
        `Operating margin commentary was measured: leadership noted possible margin pressure from ${seed.themes.risk} over the next two quarters.`,
        `Guidance was maintained, with management highlighting disciplined cost control and a healthy order and demand pipeline.`,
      ],
    },
    {
      type: "Demo SEBI Filing",
      title: `Demo Regulatory Disclosure Filing — ${c}`,
      date: "2026-08-06",
      paras: [
        `Fictional Demo Document. ${c} disclosed a board-approved investment programme aimed at ${seed.themes.growth}.`,
        `The filing lists operational risks including ${seed.themes.risk}, along with broader market uncertainty and compliance obligations under prevailing regulation.`,
        `No litigation with material financial impact was reported during the period covered by this fictional filing.`,
      ],
    },
    {
      type: "Demo Corporate Disclosure",
      title: `Demo Business Update — ${c}`,
      date: "2026-08-19",
      paras: [
        `Fictional Demo Document. ${c} shared an operational update covering expansion in the ${seed.sector} segment and improved throughput at key facilities.`,
        `The update cautions that revenue performance may remain uneven due to ${seed.themes.risk} and shifting customer budgets.`,
        `Management reiterated a focus on cash generation and returns on invested capital.`,
      ],
    },
  ];
  return defs.map((d, i) => ({
    document_id: `${seed.symbol}-DOC-${i + 1}`,
    stock_symbol: seed.symbol,
    document_title: d.title,
    document_type: d.type,
    date: d.date,
    content: d.paras.join(" "),
    chunks: d.paras.map((text, j) => ({ chunk_id: `${seed.symbol}-DOC-${i + 1}-C${j + 1}`, text })),
  }));
}

export const DOCUMENT_CORPUS: StockDocument[] = SEEDS.flatMap(buildDocuments);

export const STOCK_REGISTRY: Stock[] = SEEDS.map((seed) => ({
  symbol: seed.symbol,
  company_name: seed.company_name,
  sector: seed.sector,
  data_source_id: `demo-nse-${seed.symbol.toLowerCase()}`,
  current_price: seed.price,
  daily_change_percent: seed.change,
  trading_volume: seed.volume,
  volume_change_percent: seed.volume_change,
  price_history: buildHistory(seed),
  sentiment_feed: buildSentiment(seed),
  document_ids: DOCUMENT_CORPUS.filter((d) => d.stock_symbol === seed.symbol).map((d) => d.document_id),
}));

export function getStockData(symbol: string): Stock | undefined {
  return STOCK_REGISTRY.find((s) => s.symbol === symbol);
}

export function searchStocks(query: string): Stock[] {
  const q = query.trim().toLowerCase();
  if (!q) return STOCK_REGISTRY;
  return STOCK_REGISTRY.filter(
    (s) =>
      s.symbol.toLowerCase().includes(q) ||
      s.company_name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q),
  );
}

export function getDocumentsForStock(symbol: string): StockDocument[] {
  return DOCUMENT_CORPUS.filter((d) => d.stock_symbol === symbol);
}

export const formatINR = (v: number, digits = 2) =>
  "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const formatVolume = (v: number) =>
  v >= 10_000_000 ? `${(v / 10_000_000).toFixed(2)} Cr` : v >= 100_000 ? `${(v / 100_000).toFixed(2)} L` : v.toLocaleString("en-IN");
