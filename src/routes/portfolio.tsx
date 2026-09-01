import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQuantara } from "@/lib/quantara/store";
import { STOCK_REGISTRY, formatINR } from "@/lib/quantara/registry";
import { SectionLabel } from "@/components/quantara/primitives";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — QUANTARA" },
      { name: "description", content: "See your holdings in rupees, allocation weights, P&L and a concentration risk score computed across your positions." },
      { property: "og:title", content: "Portfolio — QUANTARA" },
      { property: "og:description", content: "Holdings, allocation weights and concentration risk in INR." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { portfolio, addHolding, removeHolding } = useQuantara();
  const [symbol, setSymbol] = useState(STOCK_REGISTRY[0]!.symbol);
  const [shares, setShares] = useState("10");
  const [avg, setAvg] = useState("1000");

  const bandTone =
    portfolio.band === "High" ? "text-red-600" : portfolio.band === "Moderate" ? "text-gold" : "text-emerald-600";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Concentration risk is computed from allocation weights across your holdings.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Current value" value={formatINR(portfolio.total_value, 0)} />
        <Stat label="Invested" value={formatINR(portfolio.total_cost, 0)} />
        <Stat label="Concentration" value={`${portfolio.score}/100`} sub={<span className={bandTone}>{portfolio.band} risk · top weight {portfolio.top_weight.toFixed(1)}%</span>} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Shares</th>
              <th className="px-4 py-3">Avg cost</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">P&amp;L</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {portfolio.rows.map((r) => {
              const h = portfolio.rows.indexOf(r);
              return (
                <tr key={`${r.symbol}-${h}`} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.symbol}</p>
                    <p className="text-xs text-muted-foreground">{r.company_name}</p>
                  </td>
                  <td className="px-4 py-3">{r.shares}</td>
                  <td className="px-4 py-3">{formatINR(r.avg_price)}</td>
                  <td className="px-4 py-3">{formatINR(r.current_price)}</td>
                  <td className="px-4 py-3">{formatINR(r.value, 0)}</td>
                  <td className="px-4 py-3">{r.allocation.toFixed(1)}%</td>
                  <td className={r.pnl_percent >= 0 ? "px-4 py-3 text-emerald-600" : "px-4 py-3 text-red-600"}>
                    {r.pnl_percent >= 0 ? "+" : ""}
                    {r.pnl_percent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <HoldingRemove symbol={r.symbol} onRemove={removeHolding} />
                  </td>
                </tr>
              );
            })}
            {portfolio.rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No holdings yet — add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <SectionLabel>Add holding</SectionLabel>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            const s = Number(shares);
            const a = Number(avg);
            if (!s || !a) return;
            addHolding({ symbol, shares: s, avg_price: a });
          }}
        >
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} aria-label="Stock" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            {STOCK_REGISTRY.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol}
              </option>
            ))}
          </select>
          <input value={shares} onChange={(e) => setShares(e.target.value)} inputMode="numeric" aria-label="Shares" placeholder="Shares" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <input value={avg} onChange={(e) => setAvg(e.target.value)} inputMode="decimal" aria-label="Average price in rupees" placeholder="Avg price ₹" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          <button type="submit" className="rounded-xl bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

function HoldingRemove({ symbol, onRemove }: { symbol: string; onRemove: (id: string) => void }) {
  const { holdings } = useQuantara();
  const holding = holdings.find((h) => h.symbol === symbol);
  if (!holding) return null;
  return (
    <button onClick={() => onRemove(holding.id)} aria-label={`Remove ${symbol}`} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
      <Trash2 className="size-4" />
    </button>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
      {sub && <p className="mt-1 text-xs">{sub}</p>}
    </div>
  );
}
