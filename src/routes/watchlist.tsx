import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { X, ArrowUpRight } from "lucide-react";
import { useQuantara } from "@/lib/quantara/store";
import { getStockData, formatINR } from "@/lib/quantara/registry";
import { StockSelector } from "@/components/quantara/StockSelector";
import { SectionLabel, VerdictBadge } from "@/components/quantara/primitives";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — QUANTARA" },
      { name: "description", content: "Track the Indian equities you follow, with live demo prices and the latest QUANTARA agent verdict for each." },
      { property: "og:title", content: "Watchlist — QUANTARA" },
      { property: "og:description", content: "Track the Indian equities you follow with the latest multi-agent verdict." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { watchlist, removeFromWatchlist, addToWatchlist, setSelected, latestFor } = useQuantara();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Watchlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stocks you are following. Open any name to run a fresh multi-agent analysis.</p>
      </header>

      <div className="max-w-md">
        <SectionLabel>Add a stock</SectionLabel>
        <div className="mt-2">
          <StockSelector onPick={(s) => addToWatchlist(s)} />
        </div>
      </div>

      {watchlist.length === 0 ? (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
          Your watchlist is empty. Add a stock above to start tracking it.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {watchlist.map((sym) => {
            const stock = getStockData(sym);
            if (!stock) return null;
            const last = latestFor(sym);
            const up = stock.daily_change_percent >= 0;
            return (
              <li key={sym} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg">{sym}</p>
                    <p className="truncate text-xs text-muted-foreground">{stock.company_name}</p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(sym)}
                    aria-label={`Remove ${sym} from watchlist`}
                    className="ml-auto rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xl">{formatINR(stock.current_price)}</p>
                    <p className={up ? "text-xs text-emerald-600" : "text-xs text-red-600"}>
                      {up ? "+" : ""}
                      {stock.daily_change_percent.toFixed(2)}% today
                    </p>
                  </div>
                  {last ? <VerdictBadge verdict={last.synthesis.recommendation} /> : <span className="text-xs text-muted-foreground">No analysis yet</span>}
                </div>
                <button
                  onClick={() => {
                    setSelected(sym);
                    navigate({ to: "/" });
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
                >
                  Analyse <ArrowUpRight className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
