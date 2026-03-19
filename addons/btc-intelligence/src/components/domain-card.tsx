import type { ConfidenceLevel } from "../lib/types";

interface DomainCardProps {
  title: string;
  state: string;
  reasoning: string[];
  confidence: ConfidenceLevel;
}

/** State → left accent border + subtle background tint */
const STATE_THEME: Record<string, { border: string; bg: string; text: string }> = {
  supportive: { border: "border-l-emerald-500", bg: "bg-emerald-500/5", text: "text-emerald-400" },
  neutral:    { border: "border-l-blue-400",    bg: "bg-blue-500/5",    text: "text-blue-400" },
  cool:       { border: "border-l-cyan-400",    bg: "bg-cyan-500/5",    text: "text-cyan-400" },
  warming:    { border: "border-l-yellow-500",  bg: "bg-yellow-500/5",  text: "text-yellow-400" },
  stretched:  { border: "border-l-red-500",     bg: "bg-red-500/5",     text: "text-red-400" },
  elevated:   { border: "border-l-orange-500",  bg: "bg-orange-500/5",  text: "text-orange-400" },
  mixed:      { border: "border-l-yellow-500",  bg: "bg-yellow-500/5",  text: "text-yellow-400" },
  restrictive:{ border: "border-l-red-500",     bg: "bg-red-500/5",     text: "text-red-400" },
};

const DEFAULT_STATE_THEME = {
  border: "border-l-zinc-600",
  bg: "bg-zinc-500/5",
  text: "text-zinc-400",
};

/** Confidence → visual bar */
function ConfidenceBar({ level }: { level: ConfidenceLevel }) {
  const pct = level === "high" ? 100 : level === "medium" ? 60 : 30;
  const color =
    level === "high"
      ? "bg-emerald-500"
      : level === "medium"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[9px] uppercase text-zinc-600">{level}</span>
    </div>
  );
}

export function DomainCard({
  title,
  state,
  reasoning,
  confidence,
}: DomainCardProps) {
  const theme = STATE_THEME[state.toLowerCase()] ?? DEFAULT_STATE_THEME;

  return (
    <div
      className={`rounded-lg border border-zinc-800 border-l-2 ${theme.border} ${theme.bg} p-4 transition-colors hover:border-zinc-700`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          {title}
        </h4>
        <span
          className={`text-xs font-bold uppercase ${theme.text}`}
        >
          {state}
        </span>
      </div>

      {/* Reasoning */}
      <div className="space-y-1.5">
        {reasoning.map((r, i) => (
          <p
            key={i}
            className="text-xs leading-relaxed text-zinc-400"
          >
            <span className="mr-1.5 text-zinc-600">•</span>
            {r}
          </p>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="mt-3 border-t border-zinc-800/50 pt-2.5">
        <ConfidenceBar level={confidence} />
      </div>
    </div>
  );
}
