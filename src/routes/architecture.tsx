import { createFileRoute } from "@tanstack/react-router";
import { STOCK_REGISTRY } from "@/lib/quantara/registry";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — QUANTARA" },
      { name: "description", content: "How QUANTARA works: a scalable stock registry, three specialised agents running in parallel, RAG grounding and a synthesis layer." },
      { property: "og:title", content: "Architecture — QUANTARA" },
      { property: "og:description", content: "The multi-agent pipeline behind every QUANTARA verdict." },
    ],
  }),
  component: ArchitecturePage,
});

const LAYERS = [
  { title: "Stock Registry", body: "Every ticker is a registry entry with its own data source id, price history, sentiment feed and document ids. Adding coverage means adding an entry — no code paths change." },
  { title: "Signal Layer", body: "Price momentum, volume anomaly and sentiment signals are computed deterministically and classified Bullish / Neutral / Bearish with a confidence score." },
  { title: "Retrieval (RAG)", body: "Each agent queries the document corpus for its own domain and cites the chunks it used, so every claim traces back to a visible source." },
  { title: "Specialised Agents", body: "Fundamentals, Technical and Sentiment agents run in parallel. Each returns an independent verdict, confidence, rationale and sources." },
  { title: "Synthesis Agent", body: "Weighs the agent verdicts against the user's risk profile, surfaces disagreement instead of hiding it, and explains what would change the call." },
  { title: "Degradation & Observability", body: "A missing feed marks the run degraded rather than failing it, and every run logs latency, sources cited and a mock accuracy outcome." },
];

function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Architecture</h1>
        <p className="mt-1 text-sm text-muted-foreground">No single voice decides — every angle does.</p>
      </header>

      <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed">{`  Registry ──▶ Signals ──┬─▶ Fundamentals Agent ─┐
                          ├─▶ Technical Agent    ─┼─▶ Synthesis ─▶ Verdict
       Documents ─▶ RAG ──┴─▶ Sentiment Agent    ─┘        │
                                                    Risk profile`}</pre>

      <div className="grid gap-3 sm:grid-cols-2">
        {LAYERS.map((l, i) => (
          <div key={l.title} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-gold">Layer {i + 1}</p>
            <h2 className="mt-1 font-display text-xl">{l.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{l.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border p-4">
        <h2 className="font-display text-xl">Coverage</h2>
        <p className="mt-1 text-sm text-muted-foreground">{STOCK_REGISTRY.length} NSE-style symbols currently registered.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STOCK_REGISTRY.map((s) => (
            <span key={s.symbol} className="rounded-full border border-border px-2.5 py-1 text-xs">
              {s.symbol}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
