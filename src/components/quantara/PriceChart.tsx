import { Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Stock } from "@/lib/quantara/types";
import { formatINR } from "@/lib/quantara/registry";

export function PriceChart({ stock }: { stock: Stock }) {
  const data = stock.price_history.map((p, i) => ({ ...p, i }));
  const first = data[0]!.close;
  const last = data[data.length - 1]!.close;
  const downtrend = last < first;

  // Only the 3-4 most significant single-day moves get labelled.
  const moves = data
    .slice(1)
    .map((d, idx) => ({ ...d, pct: ((d.close - data[idx]!.close) / data[idx]!.close) * 100 }))
    .filter((m) => Math.abs(m.pct) >= 0.9)
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
    .slice(0, 4);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(v: string) => v.slice(5)}
            minTickGap={40}
          />
          <YAxis
            domain={["dataMin - 20", "dataMax + 20"]}
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(v: number) => `₹${Math.round(v)}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              fontSize: 12,
            }}
            formatter={(v: number) => [formatINR(v), "Close"]}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={downtrend ? "var(--color-bear)" : "var(--color-ink)"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          {moves.map((m) => (
            <ReferenceDot
              key={m.date}
              x={m.date}
              y={m.close}
              r={3.5}
              fill={m.pct > 0 ? "var(--color-bull)" : "var(--color-bear)"}
              stroke="none"
              label={{
                value: `${m.pct > 0 ? "+" : ""}${m.pct.toFixed(1)}%`,
                position: m.pct > 0 ? "top" : "bottom",
                fontSize: 11,
                fill: m.pct > 0 ? "var(--color-bull)" : "var(--color-bear)",
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
