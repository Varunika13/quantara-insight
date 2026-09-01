import { BookOpen, LineChart, Newspaper, Sparkles, FileText, AlertTriangle } from "lucide-react";
import type { AgentOutput, AgentSource, SynthesisOutput, RiskProfile, Conflict, DataHealth } from "@/lib/quantara/types";
import { ConfidenceBar, Disclaimer, SectionLabel, VerdictBadge } from "./primitives";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof BookOpen> = {
  "Fundamentals Agent": BookOpen,
  "Technical Agent": LineChart,
  "Sentiment Agent": Newspaper,
};

export function SourceList({ sources, dark = false }: { sources: AgentSource[]; dark?: boolean }) {
  if (!sources.length) {
    return <p className={cn("text-xs", dark ? "text-white/60" : "text-muted-foreground")}>No sources retrieved — no evidence is asserted.</p>;
  }
  return (
    <ul className="space-y-2">
      {sources.map((s, i) => (
        <li
          key={i}
          className={cn(
            "rounded-xl p-3 text-xs leading-relaxed",
            dark ? "bg-white/5 text-white/80" : "bg-muted/70 text-muted-foreground",
          )}
        >
          <div className="flex items-start gap-2">
            <FileText className={cn("mt-0.5 size-4 shrink-0", dark ? "text-gold" : "text-gold")} strokeWidth={1.6} />
            <div className="min-w-0">
              <p className={cn("font-medium", dark ? "text-white" : "text-foreground")}>{s.document}</p>
              {s.type && (
                <p className="mt-0.5 text-[11px] tracking-wide uppercase opacity-70">
                  {s.type}
                  {typeof s.relevance === "number" ? ` · relevance ${s.relevance}%` : ""}
                </p>
              )}
              <p className="mt-1 italic">&ldquo;{s.snippet}&rdquo;</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AgentCard({ agent }: { agent: AgentOutput }) {
  const Icon = ICONS[agent.agent_name] ?? Sparkles;
  const unavailable = agent.verdict === "Unavailable";
  return (
    <article className="q-card flex h-full flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-muted p-2">
            <Icon className="size-5 text-ink" strokeWidth={1.6} />
          </span>
          <div>
            <h3 className="font-display text-base">{agent.agent_name}</h3>
            <p className="text-[11px] text-muted-foreground">{agent.latency_ms} ms</p>
          </div>
        </div>
        <VerdictBadge verdict={agent.verdict} />
      </header>

      {!unavailable && (
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <SectionLabel>Confidence</SectionLabel>
            <span className="text-sm font-medium">{agent.confidence}%</span>
          </div>
          <ConfidenceBar value={agent.confidence} />
        </div>
      )}

      <p className="text-sm leading-relaxed text-foreground/85">{agent.reasoning}</p>

      <div className="mt-auto space-y-2">
        <SectionLabel>Source Attribution</SectionLabel>
        <SourceList sources={agent.sources} />
      </div>
    </article>
  );
}

export function ConflictBanner({ conflict }: { conflict: Conflict }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-bear/30 bg-bear-soft p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-bear" strokeWidth={1.7} />
      <div>
        <p className="text-sm font-medium text-bear">Conflicting Agent Signals</p>
        <p className="mt-1 text-sm text-foreground/80">{conflict.message}</p>
      </div>
    </div>
  );
}

export function DegradedBanner({ health }: { health: DataHealth }) {
  const rows: [string, boolean][] = [
    ["Technical Data", health.technical],
    ["Fundamental Documents", health.fundamentals],
    ["Sentiment Feed", health.sentiment],
  ];
  return (
    <div className="rounded-2xl border border-border bg-muted/60 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.7} />
        <div className="flex-1">
          <p className="text-sm font-medium">{health.degraded ? "Degraded Data" : "Data Health"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {health.note ?? "All demo data feeds responded for this analysis."}
          </p>
          <dl className="mt-3 grid gap-2 sm:grid-cols-3">
            {rows.map(([label, ok]) => (
              <div key={label} className="rounded-xl bg-surface px-3 py-2">
                <dt className="q-label">{label}</dt>
                <dd className={cn("text-sm font-medium", ok ? "text-bull" : "text-bear")}>
                  {ok ? "Available" : "Unavailable"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function SynthesisCard({
  synthesis,
  agents,
  profile,
}: {
  synthesis: SynthesisOutput;
  agents: AgentOutput[];
  profile: RiskProfile;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border-2 border-gold bg-ink-deep text-white shadow-hero">
      <div className="space-y-6 p-6 sm:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="q-label text-gold">Unified Intelligence</p>
            <h2 className="font-display mt-1 text-2xl text-white sm:text-3xl">QUANTARA Synthesis Agent</h2>
          </div>
          <div className="text-right">
            <p className="q-label text-white/60">Overall Confidence</p>
            <p className="font-display text-4xl text-gold">{synthesis.confidence}%</p>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-gold/50 px-4 py-1.5 text-sm font-medium text-gold">
            {synthesis.recommendation}
          </span>
          <span className="text-xs text-white/60">{synthesis.latency_ms} ms · {synthesis.sources.length} sources cited</span>
        </div>

        <p className="text-sm leading-relaxed text-white/85">{synthesis.summary}</p>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="q-label text-gold">Your selected profile: {profile}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{synthesis.risk_profile_explanation}</p>
        </div>

        <div>
          <p className="q-label text-white/60">Supporting Agent Verdicts</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {agents.map((a) => (
              <div key={a.agent_name} className="rounded-xl bg-white/5 px-3 py-2">
                <p className="text-xs text-white/60">{a.agent_name}</p>
                <p className="text-sm font-medium text-white">
                  {a.verdict}
                  {a.verdict !== "Unavailable" && <span className="text-white/60"> · {a.confidence}%</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.keys(synthesis.perspectives) as RiskProfile[]).map((p) => (
            <div
              key={p}
              className={cn(
                "rounded-xl border p-3 text-xs leading-relaxed",
                p === profile ? "border-gold/60 bg-gold/10 text-white" : "border-white/10 text-white/60",
              )}
            >
              <p className="q-label mb-1 text-white/70">{p} Perspective</p>
              {synthesis.perspectives[p]}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="q-label text-gold">What would change this?</p>
          <p className="mt-2 text-sm text-white/85">{synthesis.what_would_change_this}</p>
        </div>

        <div>
          <p className="q-label mb-2 text-white/60">Source Attribution</p>
          <SourceList sources={synthesis.sources} dark />
        </div>

        <div className="border-t border-white/10 pt-4 text-white/50">
          <Disclaimer />
        </div>
      </div>
    </section>
  );
}
