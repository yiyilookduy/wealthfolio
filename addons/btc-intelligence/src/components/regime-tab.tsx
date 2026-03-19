import { RegimeHero } from "./regime-hero";
import { DomainCard } from "./domain-card";
import { DataQualityFooter } from "./data-quality-footer";
import { useBtcLatest } from "../hooks/use-btc-latest";
import { useSynthesis } from "../hooks/use-synthesis";
import { useHealth } from "../hooks/use-health";

interface RegimeTabProps {
  baseUrl: string;
  onOpenSettings?: () => void;
}

export function RegimeTab({ baseUrl, onOpenSettings }: RegimeTabProps) {
  const btc = useBtcLatest(baseUrl);
  const synthesis = useSynthesis(baseUrl);
  const health = useHealth(baseUrl);

  if (btc.isLoading || synthesis.isLoading) {
    return (
      <div className="space-y-4">
        {/* Hero skeleton */}
        <div className="h-48 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        {/* Domain cards skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
          ))}
        </div>
      </div>
    );
  }

  if (btc.error || synthesis.error) {
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6 text-center">
          <p className="text-2xl">⚠️</p>
          <p className="mt-2 text-sm font-medium text-red-400">Failed to load regime data</p>
          <p className="mt-1 text-xs text-zinc-500">{(btc.error ?? synthesis.error)?.message}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => { btc.refetch(); synthesis.refetch(); }}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Retry
            </button>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Check Settings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!btc.data || !synthesis.data) return null;

  const snapshot = btc.data.payload;
  const syn = synthesis.data;

  return (
    <div className="space-y-4">
      <RegimeHero snapshot={snapshot} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DomainCard
          title="Valuation"
          state={syn.valuation_state}
          reasoning={syn.valuation_reasoning}
          confidence={syn.valuation_confidence}
        />
        <DomainCard
          title="Leverage"
          state={syn.leverage_state}
          reasoning={syn.leverage_reasoning}
          confidence={syn.leverage_confidence}
        />
        <DomainCard
          title="Macro"
          state={syn.macro_state}
          reasoning={syn.macro_reasoning}
          confidence={syn.macro_confidence}
        />
      </div>

      <DataQualityFooter
        dataQualityTier={syn.data_quality_tier}
        engineStatus={health.data?.engine_status ?? "unknown"}
        consecutiveSuccesses={
          health.data?.runtime_stats?.consecutive_successes ?? 0
        }
      />
    </div>
  );
}
