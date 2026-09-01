import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Plus, Check, X, Clock, ShieldCheck, Quote, ChevronDown } from "lucide-react";
import logo from "@/assets/quantara-mark.png";
import { StockSelector } from "@/components/quantara/StockSelector";
import { PriceChart } from "@/components/quantara/PriceChart";
import { AgentCard, ConflictBanner, DegradedBanner, SynthesisCard, SourceList } from "@/components/quantara/AgentCards";
import { AskQuantara } from "@/components/quantara/AskQuantara";
import { ConfidenceBar, DemoTag, SectionLabel, VerdictBadge } from "@/components/quantara/primitives";
import { formatINR, formatVolume, getStockData } from "@/lib/quantara/registry";
import { runAnalysis } from "@/lib/quantara/engine";
import { useQuantara } from "@/lib/quantara/store";
import type { AnalysisSession, RiskProfile } from "@/lib/quantara/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QUANTARA — Multi-Agent AI Investment Intelligence" },
      {
        name: "description",
        content:
          "QUANTARA runs independent AI agents across fundamentals, technicals and sentiment, then synthesises one grounded, risk-profiled view for Indian retail investors.",
      },
      { property: "og:title", content: "QUANTARA — Multi-Agent AI Investment Intelligence" },
      {
        property: "og:description",
        content: "No single voice decides — every angle does. Multi-agent AI stock intelligence with visible sources.",
      },
    ],
  }),
  component: Dashboard,
});

const PROFILES: RiskProfile[] = ["Conservative", "Moderate", "Aggressive"];

function Dashboard() {
  const { selected, profile, setProfile, watchlist, addToWatchlist, portfolio, logSession } = useQuantara();
  const stock = getStockData(selected)!;
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [running, setRunning] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [traceOpen, setTraceOpen] = useState(false);

  const generate = async () => {
    setRunning(true);
    setSession(null);
    const result = await runAnalysis(stock, profile, portfolio);
    setSession(result);
    logSession(result);
    setRunning(false);
  };

  return (
    <div className="space-y-8">
      {/* Branding */}
      <section className="flex flex-col items-center gap-4 text-center">
        <img src={logo} alt="QUANTARA" width={430} height={630} className="h-20 w-auto" />
        <div>
          <h1 className="font-display text-3xl tracking-[0.2em] sm:text-4xl">QUANTARA</h1>
          <p className="mt-2 text-sm text-gold">No single voice decides — every angle does.</p>
          <p className="mt-1 text-sm text-muted-foreground">Multi-Agent AI Investment Intelligence for Retail Investors</p>
        </div>
      </section>

      {/* Controls */}
      <section className="q-card space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Select a stock</SectionLabel>
          <DemoTag label="Demo Market Data" />
        </div>
        <StockSelector />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Watchlist</SectionLabel>
            <button
              type="button"
              onClick={() => addToWatchlist(stock.symbol)}
              disabled={watchlist.includes(stock.symbol)}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-surface px-4 text-sm transition-colors hover:bg-accent/60 disabled:opacity-60"
            >
              {watchlist.includes(stock.symbol) ? <Check className="size-4 text-bull" strokeWidth={1.7} /> : <Plus className="size-4" strokeWidth={1.7} />}
              {watchlist.includes(stock.symbol) ? `${stock.symbol} in watchlist` : `Add ${stock.symbol} to watchlist`}
            </button>
          </div>
          <div className="space-y-2">
            <SectionLabel>Risk profile</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {PROFILES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProfile(p)}
                  className={cn(
                    "h-11 rounded-2xl border px-4 text-sm transition-colors",
                    p === profile ? "border-gold bg-gold-soft/50 font-medium" : "border-border bg-surface hover:bg-accent/60",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={running}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          <Sparkles className="size-5 text-gold" strokeWidth={1.7} />
          {running ? "QUANTARA agents are analyzing from every angle..." : "Generate QUANTARA Intelligence"}
        </button>
      </section>

      {/* Snapshot */}
      <section className="q-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">{stock.company_name}</h2>
            <p className="text-sm text-muted-foreground">
              {stock.symbol} · {stock.sector}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl">{formatINR(stock.current_price)}</p>
            <p className={cn("text-sm font-medium", stock.daily_change_percent >= 0 ? "text-bull" : "text-bear")}>
              {stock.daily_change_percent >= 0 ? "+" : ""}
              {stock.daily_change_percent.toFixed(2)}% today
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/60 p-4">
            <dt className="q-label">Trading Volume</dt>
            <dd className="mt-1 text-lg">{formatVolume(stock.trading_volume)}</dd>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <dt className="q-label">Volume Change</dt>
            <dd className={cn("mt-1 text-lg", stock.volume_change_percent >= 0 ? "text-bull" : "text-bear")}>
              {stock.volume_change_percent >= 0 ? "+" : ""}
              {stock.volume_change_percent.toFixed(1)}%
            </dd>
          </div>
          <div className="rounded-2xl bg-muted/60 p-4">
            <dt className="q-label">Data Source</dt>
            <dd className="mt-1 truncate text-lg">{stock.data_source_id}</dd>
          </div>
        </dl>
      </section>

      {/* Signals */}
      {session && (
        <section className="space-y-3">
          <SectionLabel>Signal Classification</SectionLabel>
          <div className="grid gap-3 md:grid-cols-3">
            {session.signals.map((s) => (
              <article key={s.signal_type} className="q-card space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="q-label">{s.signal_type}</p>
                  <VerdictBadge verdict={s.classification} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">{s.confidence}% confidence</p>
                  <ConfidenceBar value={s.confidence} />
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{s.reasoning}</p>
                <p className="text-xs text-muted-foreground">Source: {s.source}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Chart */}
      <section className="q-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>30-Day Price Trend</SectionLabel>
          <DemoTag label="Demo Price History" />
        </div>
        <PriceChart stock={stock} />
      </section>

      {running && (
        <div className="q-card flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <Clock className="size-5 animate-pulse text-gold" strokeWidth={1.7} />
          QUANTARA agents are analyzing from every angle — Fundamentals, Technical and Sentiment run in parallel.
        </div>
      )}

      {session && (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <SectionLabel>Independent Perspectives</SectionLabel>
              <span className="text-xs text-muted-foreground">3 agents · parallel execution</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {session.agents.map((a) => (
                <AgentCard key={a.agent_name} agent={a} />
              ))}
            </div>
          </section>

          <p className="text-center text-sm text-muted-foreground">
            Independent Perspectives <span className="text-gold">→</span> Unified Intelligence
          </p>

          <SynthesisCard synthesis={session.synthesis} agents={session.agents} profile={session.risk_profile} />

          {session.conflict && <ConflictBanner conflict={session.conflict} />}
          <DegradedBanner health={session.health} />

          {/* Reasoning trace */}
          <section className="q-card p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setTraceOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="font-display text-lg">Full reasoning trace</span>
              <ChevronDown className={cn("size-5 transition-transform", traceOpen && "rotate-180")} strokeWidth={1.7} />
            </button>
            {traceOpen && (
              <ol className="mt-4 space-y-3">
                {session.agents.map((a) => (
                  <li key={a.agent_name} className="rounded-2xl bg-muted/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{a.agent_name}</p>
                      <VerdictBadge verdict={a.verdict} />
                    </div>
                    <p className="mt-2 text-sm text-foreground/85">{a.reasoning}</p>
                    <div className="mt-3">
                      <SourceList sources={a.sources} />
                    </div>
                  </li>
                ))}
                <li className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-sm font-medium">QUANTARA Synthesis Agent</p>
                  <p className="mt-2 text-sm text-foreground/85">{session.synthesis.reasoning_trace_summary}</p>
                </li>
              </ol>
            )}
          </section>

          {reminder && (
            <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold-soft/40 p-4">
              <Quote className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.7} />
              <p className="flex-1 text-sm">New signals update as fresh data comes in — revisit this analysis periodically.</p>
              <button type="button" onClick={() => setReminder(false)} aria-label="Dismiss reminder">
                <X className="size-4 text-muted-foreground" strokeWidth={1.7} />
              </button>
            </div>
          )}

          {/* Session intelligence */}
          <section className="q-card p-5 sm:p-6">
            <SectionLabel>Session Intelligence</SectionLabel>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["Total Response Time", `${session.total_latency_ms} ms`],
                ["Overall Confidence", `${session.synthesis.confidence}%`],
                ["Sources Cited", `${session.sources_cited}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-muted/60 p-4">
                  <p className="q-label">{k}</p>
                  <p className="mt-1 text-lg">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {session.agents.map((a) => (
                <div key={a.agent_name} className="rounded-2xl bg-muted/60 p-3 text-sm">
                  <span className="text-muted-foreground">{a.agent_name}: </span>
                  {a.latency_ms} ms
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-gold" strokeWidth={1.7} />
              Conflicting signals: {session.conflict ? "Detected" : "None"} · Data health:{" "}
              {session.health.degraded ? "Degraded" : "Healthy"}
            </p>
          </section>
        </>
      )}

      <AskQuantara session={session} />
    </div>
  );
}
