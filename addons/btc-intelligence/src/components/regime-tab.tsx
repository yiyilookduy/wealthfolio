import { RegimeHero } from "./regime-hero";
import { DomainCard } from "./domain-card";
import { DataQualityFooter } from "./data-quality-footer";
import { useBtcLatest } from "../hooks/use-btc-latest";
import { useSynthesis } from "../hooks/use-synthesis";
import { useHealth } from "../hooks/use-health";

interface RegimeTabProps {
  baseUrl: string;
}

export function RegimeTab({ baseUrl }: RegimeTabProps) {
  const btc = useBtcLatest(baseUrl);
  const synthesis = useSynthesis(baseUrl);
  const health = useHealth(baseUrl);

  if (btc.isLoading || synthesis.isLoading) {
    return (
      <div className="py-10 text-center text-zinc-500">
        Loading regime data...
      </div>
    );
  }

  if (btc.error || synthesis.error) {
    return (
      <div className="py-10 text-center text-red-400">
        Failed to load:{" "}
        {(btc.error ?? synthesis.error)?.message}
        <button
          onClick={() => {
            btc.refetch();
            synthesis.refetch();
          }}
          className="ml-2 underline"
        >
          Retry
        </button>
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
        sourceUrl={baseUrl}
      />
    </div>
  );
}
