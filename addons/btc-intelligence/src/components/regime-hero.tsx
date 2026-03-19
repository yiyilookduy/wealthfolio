import { useMemo } from "react";
import type { BtcSnapshot } from "../lib/types";

interface RegimeHeroProps {
  snapshot: BtcSnapshot;
}

/** Regime-specific visual treatments — gradient, glow, accent color */
const REGIME_THEME: Record<
  string,
  { gradient: string; glow: string; accent: string; textAccent: string }
> = {
  Decline: {
    gradient: "from-red-950/60 via-red-900/20 to-zinc-900/0",
    glow: "shadow-[inset_0_1px_0_0_rgba(239,68,68,0.15)]",
    accent: "border-red-700/40",
    textAccent: "text-red-400",
  },
  Accumulation: {
    gradient: "from-emerald-950/60 via-emerald-900/20 to-zinc-900/0",
    glow: "shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)]",
    accent: "border-emerald-700/40",
    textAccent: "text-emerald-400",
  },
  Advance: {
    gradient: "from-blue-950/60 via-blue-900/20 to-zinc-900/0",
    glow: "shadow-[inset_0_1px_0_0_rgba(59,130,246,0.15)]",
    accent: "border-blue-700/40",
    textAccent: "text-blue-400",
  },
  Distribution: {
    gradient: "from-amber-950/60 via-amber-900/20 to-zinc-900/0",
    glow: "shadow-[inset_0_1px_0_0_rgba(245,158,11,0.15)]",
    accent: "border-amber-700/40",
    textAccent: "text-amber-400",
  },
};

const DEFAULT_THEME = {
  gradient: "from-zinc-900/60 to-zinc-950/0",
  glow: "",
  accent: "border-zinc-700/40",
  textAccent: "text-zinc-400",
};

/** Confidence → visual dot indicator */
function ConfidenceDots({ level }: { level: string }) {
  const filled =
    level === "high" ? 3 : level === "medium" ? 2 : level === "low" ? 1 : 0;
  const color =
    level === "high"
      ? "bg-emerald-400"
      : level === "medium"
        ? "bg-yellow-400"
        : "bg-red-400";

  return (
    <div className="flex items-center gap-1" title={`Confidence: ${level}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full ${i < filled ? color : "bg-zinc-700"}`}
        />
      ))}
    </div>
  );
}

export function RegimeHero({ snapshot }: RegimeHeroProps) {
  const regime = snapshot.regime;
  const directive = snapshot.directive;
  const theme = REGIME_THEME[regime.name] ?? DEFAULT_THEME;

  const isStale = useMemo(() => {
    try {
      const ts = new Date(snapshot.meta.generated_at).getTime();
      return Date.now() - ts > 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, [snapshot.meta.generated_at]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${theme.accent} bg-gradient-to-br ${theme.gradient} ${theme.glow} p-6`}
    >
      {/* Subtle background glow circle */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${theme.gradient} opacity-40 blur-3xl`}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Current Regime
            </p>
            <h2 className={`text-4xl font-bold tracking-tight ${theme.textAccent}`}>
              {regime.name}
            </h2>
            <p className="mt-1.5 text-sm font-medium tracking-wide text-zinc-300/80">
              {directive.action}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                snapshot.uncertainty.level === "high"
                  ? "bg-red-500/15 text-red-400"
                  : snapshot.uncertainty.level === "medium"
                    ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {snapshot.uncertainty.level} uncertainty
            </span>
            <ConfidenceDots level={directive.confidence} />
          </div>
        </div>

        {/* Key metrics */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KeyMetric
            label="MVRV Zone"
            value={snapshot.onchain.mvrv_zone}
            highlight={snapshot.onchain.mvrv_zone === "UNDERVALUED"}
          />
          <KeyMetric
            label="MVRV Z-Score"
            value={snapshot.onchain.mvrv_zscore.toFixed(2)}
          />
          <KeyMetric
            label="NUPL"
            value={`${snapshot.onchain.nupl_value.toFixed(1)}%`}
          />
          <KeyMetric
            label="Bar Confirmed"
            value={snapshot.meta.bar_confirmed ? "✓ Yes" : "✗ No"}
            highlight={snapshot.meta.bar_confirmed}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-600">
          <span>
            Updated {new Date(snapshot.meta.generated_at).toLocaleDateString()}
          </span>
          {isStale && (
            <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-400">
              ⚠ Stale
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function KeyMetric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/40 px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-semibold ${highlight ? "text-emerald-400" : "text-zinc-200"}`}
      >
        {value}
      </p>
    </div>
  );
}
