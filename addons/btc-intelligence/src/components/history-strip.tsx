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

/**
 * Pad days array to always show at least `minDays` tiles.
 * Missing days render as "unknown" (gray).
 */
function padDays(
  days: { date: string; status: TrafficLight }[],
  minDays = 7,
): { date: string; status: TrafficLight }[] {
  if (days.length >= minDays) return days;

  const padded: { date: string; status: TrafficLight }[] = [];
  const existingDates = new Set(days.map((d) => d.date));

  // Fill backwards from today
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

  // Append any days from data that weren't in our range
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
      <h4 className="mb-2 text-xs uppercase text-zinc-500">
        Last {paddedDays.length} Days
      </h4>
      <div className="flex flex-wrap gap-1">
        {paddedDays.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.status}`}
            className={`h-4 w-4 cursor-default rounded-sm transition-transform hover:scale-125 ${TILE_COLORS[d.status] ?? TILE_COLORS.unknown}`}
          />
        ))}
      </div>
    </div>
  );
}
