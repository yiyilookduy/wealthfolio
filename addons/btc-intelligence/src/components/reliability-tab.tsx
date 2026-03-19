import { SystemCard } from "./system-card";
import { HistoryStrip } from "./history-strip";
import { StatusBadge } from "./status-badge";
import { useReliability } from "../hooks/use-reliability";
import { useRuns } from "../hooks/use-runs";
import type { RunEntry } from "../lib/types";

interface ReliabilityTabProps {
  baseUrl: string;
  onOpenSettings?: () => void;
}

export function ReliabilityTab({ baseUrl, onOpenSettings }: ReliabilityTabProps) {
  const rel = useReliability(baseUrl);
  const runs = useRuns(baseUrl);

  if (rel.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
      </div>
    );
  }

  if (rel.error) {
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6 text-center">
          <p className="text-2xl">⚠️</p>
          <p className="mt-2 text-sm font-medium text-red-400">Failed to load reliability data</p>
          <p className="mt-1 text-xs text-zinc-500">{rel.error.message}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => rel.refetch()}
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

  if (!rel.data) return null;

  const { status, history } = rel.data;

  return (
    <div className="space-y-5">
      {/* Overall status hero — larger, more visual weight */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <StatusBadge
          status={status.overall_status}
          className="px-5 py-1.5 text-lg"
        />
        <p className="mt-3 text-3xl font-bold text-zinc-100">
          {status.consecutive_green} day streak
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Best: {status.best_streak} days
        </p>
      </div>

      {/* System cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SystemCard
          name="Observability"
          status={status.obs_status}
          details={status.details.obs as Record<string, unknown>}
        />
        <SystemCard
          name="Regime Classifier"
          status={status.regime_status}
          details={status.details.regime as Record<string, unknown>}
        />
        <SystemCard
          name="Cron Jobs"
          status={status.cron_status}
          details={status.details.cron as Record<string, unknown>}
        />
      </div>

      {/* History strip */}
      {history && <HistoryStrip days={history.days} />}

      {/* Issues — more visual urgency */}
      {status.issues.length > 0 && (
        <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/10 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-yellow-500/80">
            Active Issues
          </h4>
          <div className="space-y-1">
            {status.issues.map((issue, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md bg-zinc-900/40 px-3 py-1.5 text-xs"
              >
                <StatusBadge status={issue.severity} />
                <span className="font-medium text-zinc-300">{issue.title}</span>
                <span className="text-zinc-500">— {issue.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run history table — status-colored rows */}
      {runs.data && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Run History (last {runs.data.count})
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-1.5 text-left font-medium">Date</th>
                <th className="text-left font-medium">Status</th>
                <th className="text-left font-medium">Trigger</th>
                <th className="text-left font-medium">Tier</th>
                <th className="text-right font-medium">Latency</th>
              </tr>
            </thead>
            <tbody>
              {runs.data.runs.map((r: RunEntry, i: number) => (
                <tr
                  key={r.run_id}
                  className={`border-b border-zinc-800/30 transition-colors hover:bg-zinc-800/30 ${
                    i % 2 === 0 ? "bg-zinc-900/20" : ""
                  }`}
                >
                  <td className="py-1.5 text-zinc-300">
                    {r.completed_at?.slice(0, 16) ?? "—"}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-zinc-400">{r.trigger}</td>
                  <td>
                    <StatusBadge status={r.validity_tier} />
                  </td>
                  <td className="text-right font-mono text-zinc-400">
                    {r.total_latency_ms
                      ? `${r.total_latency_ms}ms`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
