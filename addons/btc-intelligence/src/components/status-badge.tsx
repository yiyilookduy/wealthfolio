import { cn } from "@wealthfolio/ui";

const STATUS_STYLES: Record<string, string> = {
  // Traffic lights
  green: "bg-emerald-500/20 text-emerald-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  red: "bg-red-500/20 text-red-400",
  // Engine
  healthy: "bg-emerald-500/20 text-emerald-400",
  unhealthy: "bg-red-500/20 text-red-400",
  degraded: "bg-yellow-500/20 text-yellow-400",
  unknown: "bg-zinc-500/20 text-zinc-400",
  // Domain states
  supportive: "bg-emerald-500/20 text-emerald-400",
  neutral: "bg-blue-500/20 text-blue-400",
  stretched: "bg-red-500/20 text-red-400",
  cool: "bg-emerald-500/20 text-emerald-400",
  warming: "bg-yellow-500/20 text-yellow-400",
  elevated: "bg-red-500/20 text-red-400",
  mixed: "bg-yellow-500/20 text-yellow-400",
  restrictive: "bg-red-500/20 text-red-400",
  unavailable: "bg-zinc-500/20 text-zinc-400",
  // Confidence
  high: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-red-500/20 text-red-400",
  // Run status
  success: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
  running: "bg-blue-500/20 text-blue-400",
  // Validity
  good: "bg-emerald-500/20 text-emerald-400",
  partial: "bg-yellow-500/20 text-yellow-400",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style =
    STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.unknown;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
}
