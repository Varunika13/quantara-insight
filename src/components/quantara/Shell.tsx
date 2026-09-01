import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Eye, Briefcase, History, Activity, Network, User } from "lucide-react";
import mark from "@/assets/quantara-mark.png";

const TABS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/watchlist", label: "Watchlist", icon: Eye },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/history", label: "History", icon: History },
  { to: "/metrics", label: "Metrics", icon: Activity },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={mark} alt="QUANTARA logo" width={430} height={630} className="h-8 w-auto" />
            <span className="font-display text-lg tracking-[0.18em]">QUANTARA</span>
          </Link>
          <span className="ml-auto hidden text-xs text-muted-foreground lg:block">
            No single voice decides — <span className="text-gold">every angle does.</span>
          </span>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-2 sm:px-6">
          <ul className="flex min-w-max gap-1 pb-1">
            {TABS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex items-center gap-2 rounded-t-xl border-b-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "!border-gold !text-foreground font-medium" }}
                >
                  <Icon className="size-5" strokeWidth={1.6} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="mt-8 border-t border-border">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-center sm:px-6">
          <p className="text-sm">
            All features free — <span className="text-gold">because good financial guidance shouldn&apos;t be behind a paywall.</span>
          </p>
          <p className="text-xs text-muted-foreground">
            This is an AI-generated signal for informational purposes, not financial advice. All market data, documents and
            sentiment shown are demo/mock data.
          </p>
        </div>
      </footer>
    </div>
  );
}
