import type { TrafficLight } from "../lib/types";

const TILE_COLORS: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  unknown: "bg-zinc-700",
};

interface HistoryStripProps {
  days: { date: string; status: TrafficLight }[];
}

export function HistoryStrip({ days }: HistoryStripProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h4 className="mb-2 text-xs uppercase text-zinc-500">
        Last {days.length} Days
      </h4>
      <div className="flex flex-wrap gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.status}`}
            className={`h-4 w-4 cursor-default rounded-sm ${TILE_COLORS[d.status] ?? TILE_COLORS.unknown}`}
          />
        ))}
      </div>
    </div>
  );
}
