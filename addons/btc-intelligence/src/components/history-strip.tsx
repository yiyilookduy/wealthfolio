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

/** Pad to minimum days, filling missing dates as "unknown" */
function padDays(
  days: { date: string; status: TrafficLight }[],
  minDays = 7,
): { date: string; status: TrafficLight }[] {
  if (days.length >= minDays) return days;

  const padded: { date: string; status: TrafficLight }[] = [];
  const existingDates = new Set(days.map((d) => d.date));

  const today = new Date();
  for (let i = minDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (existingDates.has(dateStr)) {
      const found = days.find((dd) => dd.date === dateStr);
      if (found) padded.push(found);
    } else {
      padded.push({ date: dateStr, status: "unknown" });
    }
  }

  for (const day of days) {
    if (!padded.find((p) => p.date === day.date)) {
      padded.push(day);
    }
  }

  return padded;
}

export function HistoryStrip({ days }: HistoryStripProps) {
  const paddedDays = padDays(days, 7);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Last {paddedDays.length} Days
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {paddedDays.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.status}`}
            className={`group relative h-6 w-6 cursor-default rounded ${TILE_COLORS[d.status] ?? TILE_COLORS.unknown} transition-transform hover:scale-110`}
          >
            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 shadow-lg group-hover:block">
              {d.date.slice(5)}: {d.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
