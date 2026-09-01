import { useEffect, useState } from "react";
import logo from "@/assets/quantara-logo.png";

export function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    if (sessionStorage.getItem("quantara-splash-shown") === "1") {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("out"), 2400);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("quantara-splash-shown", "1");
      setPhase("done");
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-500"
      style={{ opacity: phase === "out" ? 0 : 1 }}
      aria-hidden
    >
      <div className="flex w-full max-w-md flex-col items-center px-8 text-center">
        <img
          src={logo}
          alt="QUANTARA"
          width={1024}
          height={1024}
          className="q-anim-logo h-auto w-56 max-w-[70vw] object-contain sm:w-72"
        />
        <p
          className="q-anim-fade-up mt-6 text-sm text-muted-foreground"
          style={{ animationDelay: "0.9s" }}
        >
          Initializing intelligence from every angle...
        </p>
        <div
          className="q-anim-fade-up mt-6 h-px w-40 overflow-hidden bg-border"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="q-anim-sweep h-px w-10 bg-gold" />
        </div>
      </div>
    </div>
  );
}
