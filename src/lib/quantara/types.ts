export type Classification = "Bullish" | "Neutral" | "Bearish";
export type Verdict = Classification | "Unavailable";
export type RiskProfile = "Conservative" | "Moderate" | "Aggressive";

export interface SentimentItem {
  headline: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  score: number; // -100..100
  timestamp: string;
  source_name: string;
}

export interface DocChunk {
  chunk_id: string;
  text: string;
}

export interface StockDocument {
  document_id: string;
  stock_symbol: string;
  document_title: string;
  document_type: string;
  date: string;
  content: string;
  chunks: DocChunk[];
}

export interface Stock {
  symbol: string;
  company_name: string;
  sector: string;
  data_source_id: string;
  current_price: number;
  daily_change_percent: number;
  trading_volume: number;
  volume_change_percent: number;
  price_history: { date: string; close: number }[];
  sentiment_feed: SentimentItem[];
  document_ids: string[];
}

export interface Signal {
  signal_type: string;
  classification: Classification;
  confidence: number;
  reasoning: string;
  source: string;
}

export interface AgentSource {
  document: string;
  snippet: string;
  type?: string | undefined;
  relevance?: number | undefined;
}

export interface AgentOutput {
  agent_name: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  sources: AgentSource[];
  latency_ms: number;
}

export type FinalVerdict = "BUY" | "HOLD" | "AVOID";
export type AgentAgreement = "Full Agreement" | "Partial Agreement" | "Conflicting";

export interface SynthesisDecision {
  stock_symbol: string;
  final_verdict: FinalVerdict;
  confidence: number;
  justification: string;
  agent_agreement: AgentAgreement;
  contributing_agents: string[];
  cited_sources: string[];
  risk_flags: string[];
  disclaimer: string;
}

export interface SynthesisOutput {
  agent_name: "QUANTARA Synthesis Agent";
  recommendation: "Bullish" | "Neutral" | "Bearish" | "Cautious Opportunity";
  confidence: number;
  summary: string;
  risk_profile_explanation: string;
  reasoning_trace_summary: string;
  what_would_change_this: string;
  sources: AgentSource[];
  perspectives: Record<RiskProfile, string>;
  decision: SynthesisDecision;
  latency_ms: number;
}

export interface DataHealth {
  technical: boolean;
  fundamentals: boolean;
  sentiment: boolean;
  degraded: boolean;
  note?: string | undefined;
}

export interface Conflict {
  agents: string[];
  message: string;
}

export interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avg_price: number;
}

export interface PortfolioRisk {
  total_value: number;
  total_cost: number;
  score: number; // 0-100
  band: "Low" | "Moderate" | "High";
  top_weight: number;
  rows: {
    symbol: string;
    company_name: string;
    shares: number;
    avg_price: number;
    current_price: number;
    value: number;
    allocation: number;
    pnl_percent: number;
  }[];
}

export interface AnalysisSession {
  id: string;
  created_at: string;
  symbol: string;
  company_name: string;
  risk_profile: RiskProfile;
  signals: Signal[];
  agents: AgentOutput[];
  synthesis: SynthesisOutput;
  conflict: Conflict | null;
  health: DataHealth;
  total_latency_ms: number;
  sources_cited: number;
  mock_forward_return: number;
  accuracy_placeholder: "Matched Direction" | "Missed Direction" | "Neutral Call";
  portfolio_concentration: number;
}
