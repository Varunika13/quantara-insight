import { createFileRoute } from "@tanstack/react-router";
import { useQuantara } from "@/lib/quantara/store";

export const Route = createFileRoute("/metrics")({
  head: () => ({
    meta: [
      { title: "System Metrics — QUANTARA" },
      { name: "description", content: "Observability for the agent pipeline: response latency, mock signal accuracy, source grounding and portfolio concentration." },
      { property: "og:title", content: "System Metrics — QUANTARA" },
      { property: "og:description", content: "Latency, mock accuracy and grounding metrics for the agent pipeline." },
    ],
  }),
  component: MetricsPage,
});

function MetricsPage() {
  const { sessions, portfolio } = useQuantara();
  const n = sessions.length || 1;
  const avgLatency = Math.round(sessions.reduce((a, s) => a + s.total_latency_ms, 0) / n);
  const scored = sessions.filter((s) => s.accuracy_placeholder !== "Neutral Call");
  const matched = scored.filter((s) => s.accuracy_placeholder === "Matched Direction").length;
  const accuracy = scored.length ? Math.round((matched / scored.length) * 100) : 0;
  const avgSources = (sessions.reduce((a, s) => a + s.sources_cited, 0) / n).toFixed(1);
  const conflicts = sessions.filter((s) => s.conflict).length;
  const degraded = sessions.filter((s) => s.health.degraded).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">System Metrics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Logged across {sessions.length} analysis sessions. Accuracy uses mock forward returns.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Avg response latency" value={`${avgLatency} ms`} note="Wall clock across all agents plus synthesis" />
        <Metric label="Signal accuracy (mock)" value={`${accuracy}%`} note={`${matched}/${scored.length} directional calls matched`} />
        <Metric label="Avg sources cited" value={avgSources} note="RAG grounding per analysis" />
        <Metric label="Agent disagreements" value={`${conflicts}`} note="Sessions where agents diverged" />
        <Metric label="Degraded-data runs" value={`${degraded}`} note="Sessions with a missing data feed" />
        <Metric label="Portfolio concentration" value={`${portfolio.score}/100`} note={`${portfolio.band} risk · top weight ${portfolio.top_weight.toFixed(1)}%`} />
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h2 className="font-display text-xl">Latency by session</h2>
        <ul className="mt-3 space-y-2">
          {sessions.slice(0, 10).map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 truncate">{s.symbol}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-gold" style={{ width: `${Math.min(100, s.total_latency_ms / 25)}%` }} />
              </span>
              <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{s.total_latency_ms} ms</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
