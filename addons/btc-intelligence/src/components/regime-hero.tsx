import { useMemo } from "react";
import type { BtcSnapshot } from "../lib/types";
import { StatusBadge } from "./status-badge";

interface RegimeHeroProps {
  snapshot: BtcSnapshot;
}

const REGIME_GRADIENTS: Record<string, string> = {
  Accumulation: "from-emerald-900/30 to-emerald-950/10",
  Advance: "from-blue-900/30 to-blue-950/10",
  Distribution: "from-amber-900/30 to-amber-950/10",
  Decline: "from-red-900/30 to-red-950/10",
};

export function RegimeHero({ snapshot }: RegimeHeroProps) {
  const regime = snapshot.regime;
  const directive = snapshot.directive;
  const gradient =
    REGIME_GRADIENTS[regime.name] ?? "from-zinc-900/30 to-zinc-950/10";

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
      className={`rounded-xl border border-zinc-800 bg-gradient-to-br ${gradient} p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">
            Current Regime
          </p>
          <h2 className="text-3xl font-bold text-zinc-100">
            {regime.name}
          </h2>
          <p className="mt-2 text-sm font-medium text-zinc-300">
            {directive.action}
          </p>
        </div>
        <StatusBadge
          status={snapshot.uncertainty.level}
          className="mt-1"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniMetric
          label="MVRV Zone"
          value={snapshot.onchain.mvrv_zone}
        />
        <MiniMetric
          label="MVRV Z-Score"
          value={snapshot.onchain.mvrv_zscore.toFixed(2)}
        />
        <MiniMetric
          label="NUPL"
          value={snapshot.onchain.nupl_value.toFixed(3)}
        />
        <MiniMetric
          label="Confidence"
          value={directive.confidence}
        />
      </div>

      <p className="mt-3 text-[10px] text-zinc-500">
        Updated: {snapshot.meta.generated_at} · Bar confirmed:{" "}
        {snapshot.meta.bar_confirmed ? "Yes" : "No"}
        {isStale && (
          <span className="ml-2 rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-400">⚠ Data may be stale</span>
        )}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}
