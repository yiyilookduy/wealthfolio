import type { TrafficLight } from "../lib/types";

const DOT_COLORS: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  unknown: "bg-zinc-500",
};

interface SystemCardProps {
  name: string;
  status: TrafficLight;
  details: Record<string, unknown>;
}

export function SystemCard({ name, status, details }: SystemCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${DOT_COLORS[status] ?? DOT_COLORS.unknown}`}
        />
        <h4 className="text-sm font-medium text-zinc-200">{name}</h4>
        <span className="ml-auto text-xs uppercase text-zinc-500">
          {status}
        </span>
      </div>
      <dl className="space-y-1 text-xs">
        {Object.entries(details)
          .slice(0, 5)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-zinc-500">
                {k.replace(/_/g, " ")}
              </dt>
              <dd className="font-mono text-zinc-300">{String(v)}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
