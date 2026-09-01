import { useMemo, useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { searchStocks, formatINR } from "@/lib/quantara/registry";
import { useQuantara } from "@/lib/quantara/store";
import { cn } from "@/lib/utils";

export function StockSelector({ onPick }: { onPick?: (symbol: string) => void }) {
  const { selected, setSelected, watchlist, addToWatchlist } = useQuantara();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchStocks(query).slice(0, 8), [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company or NSE symbol (e.g. HDFCBANK)"
          className="h-12 w-full rounded-2xl border border-border bg-surface pr-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-gold/40"
          aria-label="Search stocks"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((s) => {
          const active = s.symbol === selected;
          const inList = watchlist.includes(s.symbol);
          return (
            <div
              key={s.symbol}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors",
                active ? "border-gold/60 bg-gold-soft/40" : "border-border bg-surface hover:bg-accent/50",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelected(s.symbol);
                  onPick?.(s.symbol);
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium">{s.company_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.symbol} · {s.sector} · {formatINR(s.current_price)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => addToWatchlist(s.symbol)}
                disabled={inList}
                aria-label={`Add ${s.symbol} to watchlist`}
                className="shrink-0 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {inList ? <Check className="size-4 text-bull" strokeWidth={1.8} /> : <Plus className="size-4" strokeWidth={1.8} />}
              </button>
            </div>
          );
        })}
        {!results.length && <p className="text-sm text-muted-foreground">No stocks match that search.</p>}
      </div>
    </div>
  );
}
