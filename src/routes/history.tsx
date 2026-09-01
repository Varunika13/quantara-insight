import { createFileRoute } from "@tanstack/react-router";
import { useQuantara } from "@/lib/quantara/store";
import { VerdictBadge } from "@/components/quantara/primitives";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis History — QUANTARA" },
      { name: "description", content: "Every multi-agent analysis QUANTARA has run for you, with the verdict, confidence, risk profile and mock forward return." },
      { property: "og:title", content: "Analysis History — QUANTARA" },
      { property: "og:description", content: "An archive of past multi-agent verdicts and their outcomes." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { sessions } = useQuantara();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Analysis History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Archived sessions, newest first. Forward returns are mock data for demonstration.</p>
      </header>

      {sessions.length === 0 ? (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">No analyses yet.</p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-display text-lg">{s.symbol}</p>
                  <p className="text-xs text-muted-foreground">{s.company_name}</p>
                </div>
                <VerdictBadge verdict={s.synthesis.recommendation} />
                <span className="text-xs text-muted-foreground">{s.synthesis.confidence}% confidence</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.synthesis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Chip>{s.risk_profile} profile</Chip>
                <Chip>{s.total_latency_ms} ms</Chip>
                <Chip>{s.sources_cited} sources</Chip>
                {s.conflict && <Chip>Agent disagreement</Chip>}
                {s.health.degraded && <Chip>Degraded data</Chip>}
                <Chip>
                  Mock forward return {s.mock_forward_return >= 0 ? "+" : ""}
                  {s.mock_forward_return.toFixed(1)}% · {s.accuracy_placeholder}
                </Chip>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border px-2.5 py-1">{children}</span>;
}
