import { cn } from "@/lib/utils";
import type { Classification, Verdict } from "@/lib/quantara/types";

export function verdictTone(v: Verdict | string) {
  switch (v) {
    case "Bullish":
      return { text: "text-bull", bg: "bg-bull-soft", ring: "ring-bull/25" };
    case "Bearish":
      return { text: "text-bear", bg: "bg-bear-soft", ring: "ring-bear/25" };
    case "Cautious Opportunity":
      return { text: "text-bull", bg: "bg-bull-soft", ring: "ring-bull/20" };
    default:
      return { text: "text-flat", bg: "bg-flat-soft", ring: "ring-flat/20" };
  }
}

export function VerdictBadge({ verdict, className }: { verdict: Verdict | string; className?: string }) {
  const t = verdictTone(verdict);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        t.bg,
        t.text,
        t.ring,
        className,
      )}
    >
      {verdict}
    </span>
  );
}

export function ConfidenceBar({ value, tone = "neutral" }: { value: number; tone?: "neutral" | "gold" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all", tone === "gold" ? "bg-gold" : "bg-ink/70")}
        style={{ width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("q-label", className)}>{children}</p>;
}

export function DemoTag({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
      {label}
    </span>
  );
}

export function ClassificationDot({ c }: { c: Classification }) {
  const t = verdictTone(c);
  return <span className={cn("inline-block size-2 rounded-full", t.text.replace("text-", "bg-"))} aria-hidden />;
}

export function Disclaimer() {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      This is an AI-generated signal for informational purposes, not financial advice.
    </p>
  );
}
