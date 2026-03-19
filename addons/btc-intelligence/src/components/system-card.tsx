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

/**
 * Render a value smartly — handles nested objects, arrays, primitives.
 * Returns a human-readable string, never "[object Object]".
 */
function renderValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "✓" : "✗";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;

  // Array of objects → count summary
  if (Array.isArray(v)) {
    if (v.length === 0) return "none";
    // If items have a "name" field (e.g. cron jobs), list names
    if (typeof v[0] === "object" && v[0] !== null && "name" in v[0]) {
      return v.map((item) => (item as { name: string }).name).join(", ");
    }
    return `${v.length} items`;
  }

  // Nested object — extract "status" or "message" if exists
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if ("status" in obj && typeof obj.status === "string") {
      return obj.status;
    }
    if ("message" in obj && typeof obj.message === "string") {
      const msg = obj.message;
      return msg.length > 60 ? msg.slice(0, 57) + "…" : msg;
    }
    // Fallback: count keys
    return `${Object.keys(obj).length} fields`;
  }

  return String(v);
}

/**
 * Flatten nested detail objects one level deep for display.
 * E.g. model_health_checks: { zscore_compression: { status: "warning" } }
 * → show "zscore_compression": "warning" instead of [object Object]
 */
function flattenDetails(details: Record<string, unknown>): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(details)) {
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) continue;

    // If value is a dict of sub-checks (like model_health_checks), expand
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value as Record<string, unknown>).every(
        (sub) => typeof sub === "object" && sub !== null
      )
    ) {
      // Nested dict of dicts → extract status from each
      for (const [subKey, subVal] of Object.entries(
        value as Record<string, unknown>
      )) {
        result.push([subKey, renderValue(subVal)]);
      }
    } else {
      result.push([key, renderValue(value)]);
    }
  }

  return result.slice(0, 6); // cap at 6 rows
}

export function SystemCard({ name, status, details }: SystemCardProps) {
  const rows = flattenDetails(details);

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
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2">
            <dt className="shrink-0 text-zinc-500">
              {k.replace(/_/g, " ")}
            </dt>
            <dd className="truncate font-mono text-zinc-300" title={v}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
