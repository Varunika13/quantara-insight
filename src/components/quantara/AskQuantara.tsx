import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { askQuantara } from "@/lib/quantara/engine";
import { useQuantara } from "@/lib/quantara/store";
import type { AnalysisSession } from "@/lib/quantara/types";

const SUGGESTIONS = [
  "Why is the Technical Agent bullish?",
  "What makes this risky for my profile?",
  "Which source supports the Fundamentals Agent?",
  "Should I consider this based on my current portfolio?",
];

export function AskQuantara({ session }: { session: AnalysisSession | null }) {
  const { profile, portfolio } = useQuantara();
  const [input, setInput] = useState("");
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);

  const send = (q: string) => {
    if (!q.trim()) return;
    setThread((t) => [...t, { q, a: askQuantara(q, session, profile, portfolio) }]);
    setInput("");
  };

  return (
    <section className="q-card p-5 sm:p-6">
      <header className="flex items-center gap-3">
        <span className="rounded-xl bg-muted p-2">
          <MessageCircle className="size-5 text-gold" strokeWidth={1.6} />
        </span>
        <div>
          <h3 className="font-display text-lg">Ask Quantara</h3>
          <p className="text-xs text-muted-foreground">Ask Quantara about this analysis — answers use only agent outputs and cited sources.</p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {thread.length > 0 && (
        <div className="mt-5 space-y-4">
          {thread.map((t, i) => (
            <div key={i} className="space-y-2">
              <p className="text-sm font-medium">{t.q}</p>
              <p className="rounded-2xl bg-muted/70 p-4 text-sm leading-relaxed whitespace-pre-line text-foreground/85">{t.a}</p>
            </div>
          ))}
        </div>
      )}

      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this analysis..."
          aria-label="Ask Quantara"
          className="h-11 flex-1 rounded-2xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-gold/40"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-ink px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="size-4" strokeWidth={1.7} />
          Ask
        </button>
      </form>
    </section>
  );
}
