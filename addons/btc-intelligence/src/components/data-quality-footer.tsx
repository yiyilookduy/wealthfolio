import { StatusBadge } from "./status-badge";

interface DataQualityFooterProps {
  dataQualityTier: string | null;
  engineStatus: string;
  consecutiveSuccesses: number;
}

export function DataQualityFooter({
  dataQualityTier,
  engineStatus,
  consecutiveSuccesses,
}: DataQualityFooterProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-zinc-800/50 bg-zinc-950/50 px-4 py-2 text-[11px] text-zinc-500">
      <span>
        Quality: <StatusBadge status={dataQualityTier ?? "unknown"} />
      </span>
      <span>
        Engine: <StatusBadge status={engineStatus} />
      </span>
      <span>Streak: {consecutiveSuccesses} runs</span>
    </div>
  );
}
