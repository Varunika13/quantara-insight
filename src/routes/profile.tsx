import { createFileRoute } from "@tanstack/react-router";
import { useQuantara } from "@/lib/quantara/store";
import type { RiskProfile } from "@/lib/quantara/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — QUANTARA" },
      { name: "description", content: "Set your investor risk profile so the synthesis agent frames every recommendation the way you actually invest." },
      { property: "og:title", content: "Your Profile — QUANTARA" },
      { property: "og:description", content: "Choose Conservative, Moderate or Aggressive framing for every verdict." },
    ],
  }),
  component: ProfilePage,
});

const OPTIONS: { key: RiskProfile; blurb: string }[] = [
  { key: "Conservative", blurb: "Capital preservation first. Verdicts lean cautious and require stronger agreement across agents." },
  { key: "Moderate", blurb: "Balanced. Agents are weighted evenly and disagreement is surfaced without over-penalising the call." },
  { key: "Aggressive", blurb: "Growth first. Momentum and sentiment carry more weight, with volatility treated as opportunity." },
];

function ProfilePage() {
  const { profile, setProfile, watchlist, holdings, sessions } = useQuantara();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Your Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your risk profile changes how the synthesis agent frames every recommendation.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setProfile(o.key)}
            aria-pressed={profile === o.key}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              profile === o.key ? "border-gold bg-card" : "border-border hover:border-foreground/30",
            )}
          >
            <p className="font-display text-xl">{o.key}</p>
            <p className="mt-2 text-sm text-muted-foreground">{o.blurb}</p>
            {profile === o.key && <p className="mt-3 text-xs text-gold">Active</p>}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Watchlist" value={`${watchlist.length}`} />
        <Stat label="Holdings" value={`${holdings.length}`} />
        <Stat label="Analyses run" value={`${sessions.length}`} />
      </div>

      <p className="text-xs text-muted-foreground">
        QUANTARA is a demonstration built on mock market data. Nothing here is financial advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
