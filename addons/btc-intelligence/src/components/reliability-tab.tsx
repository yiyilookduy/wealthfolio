import { SystemCard } from "./system-card";
import { HistoryStrip } from "./history-strip";
import { StatusBadge } from "./status-badge";
import { useReliability } from "../hooks/use-reliability";
import { useRuns } from "../hooks/use-runs";
import type { RunEntry } from "../lib/types";

interface ReliabilityTabProps {
  baseUrl: string;
}

export function ReliabilityTab({ baseUrl }: ReliabilityTabProps) {
  const rel = useReliability(baseUrl);
  const runs = useRuns(baseUrl);

  if (rel.isLoading) {
    return (
      <div className="py-10 text-center text-zinc-500">Loading...</div>
    );
  }

  if (rel.error) {
    return (
      <div className="py-10 text-center text-red-400">
        {rel.error.message}
        <button
          onClick={() => rel.refetch()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!rel.data) return null;

  const { status, history } = rel.data;

  return (
    <div className="space-y-4">
      {/* Overall status hero */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
        <StatusBadge
          status={status.overall_status}
          className="px-4 py-1 text-lg"
        />
        <p className="mt-2 text-2xl font-bold text-zinc-100">
          {status.consecutive_green} day streak
        </p>
        <p className="text-xs text-zinc-500">
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
          details={
            status.details.regime as Record<string, unknown>
          }
        />
        <SystemCard
          name="Cron Jobs"
          status={status.cron_status}
          details={status.details.cron as Record<string, unknown>}
        />
      </div>

      {/* History strip */}
      {history && <HistoryStrip days={history.days} />}

      {/* Issues */}
      {status.issues.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h4 className="mb-2 text-xs uppercase text-zinc-500">
            Active Issues
          </h4>
          {status.issues.map((issue, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1 text-xs"
            >
              <StatusBadge status={issue.severity} />
              <span className="text-zinc-300">{issue.title}</span>
              <span className="text-zinc-500">— {issue.detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Run history table */}
      {runs.data && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h4 className="mb-2 text-xs uppercase text-zinc-500">
            Run History (last {runs.data.count})
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-1 text-left">Date</th>
                <th className="text-left">Status</th>
                <th className="text-left">Trigger</th>
                <th className="text-left">Tier</th>
                <th className="text-right">Latency</th>
              </tr>
            </thead>
            <tbody>
              {runs.data.runs.map((r: RunEntry) => (
                <tr
                  key={r.run_id}
                  className="border-b border-zinc-800/50"
                >
                  <td className="py-1 text-zinc-300">
                    {r.completed_at?.slice(0, 16) ?? "—"}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-zinc-400">{r.trigger}</td>
                  <td className="text-zinc-400">
                    {r.validity_tier}
                  </td>
                  <td className="text-right text-zinc-400">
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
