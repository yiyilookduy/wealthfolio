import type { TrafficLight } from "../lib/types";

const DOT_COLORS: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  unknown: "bg-zinc-500",
};

const ACCENT_BORDERS: Record<string, string> = {
  green: "border-t-emerald-500/40",
  yellow: "border-t-yellow-500/40",
  red: "border-t-red-500/40",
  unknown: "border-t-zinc-600/40",
};

interface SystemCardProps {
  name: string;
  status: TrafficLight;
  details: Record<string, unknown>;
}

/** Smart value rendering — handles nested objects, arrays, primitives */
function renderValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "✓" : "✗";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;

  if (Array.isArray(v)) {
    if (v.length === 0) return "none";
    if (typeof v[0] === "object" && v[0] !== null && "name" in v[0]) {
      return v.map((item) => (item as { name: string }).name).join(", ");
    }
    return `${v.length} items`;
  }

  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if ("status" in obj && typeof obj.status === "string") return obj.status;
    if ("message" in obj && typeof obj.message === "string") {
      const msg = obj.message;
      return msg.length > 50 ? msg.slice(0, 47) + "…" : msg;
    }
    return `${Object.keys(obj).length} fields`;
  }

  return String(v);
}

/** Flatten nested details one level */
function flattenDetails(details: Record<string, unknown>): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(details)) {
    if (Array.isArray(value) && value.length === 0) continue;

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value as Record<string, unknown>).every(
        (sub) => typeof sub === "object" && sub !== null,
      )
    ) {
      for (const [subKey, subVal] of Object.entries(
        value as Record<string, unknown>,
      )) {
        result.push([subKey, renderValue(subVal)]);
      }
    } else {
      result.push([key, renderValue(value)]);
    }
  }

  return result.slice(0, 6);
}

/** Status-aware value color */
function valueColor(v: string): string {
  const lower = v.toLowerCase();
  if (lower === "ok" || lower === "healthy" || lower === "✓") return "text-emerald-400";
  if (lower === "warning" || lower === "degraded") return "text-yellow-400";
  if (lower === "error" || lower === "critical" || lower === "✗") return "text-red-400";
  return "text-zinc-300";
}

export function SystemCard({ name, status, details }: SystemCardProps) {
  const rows = flattenDetails(details);
  const accentBorder = ACCENT_BORDERS[status] ?? ACCENT_BORDERS.unknown;

  return (
    <div
      className={`rounded-lg border border-zinc-800 border-t-2 ${accentBorder} bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[status] ?? DOT_COLORS.unknown} ring-2 ring-zinc-800`}
        />
        <h4 className="text-sm font-semibold text-zinc-200">{name}</h4>
        <span className="ml-auto text-[10px] font-bold uppercase text-zinc-500">
          {status}
        </span>
      </div>
      <dl className="space-y-1 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2">
            <dt className="shrink-0 text-zinc-500">
              {k.replace(/_/g, " ")}
            </dt>
            <dd className={`truncate font-mono ${valueColor(v)}`} title={v}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
