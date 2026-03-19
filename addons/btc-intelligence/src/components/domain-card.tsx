import type { ConfidenceLevel } from "../lib/types";
import { StatusBadge } from "./status-badge";

interface DomainCardProps {
  title: string;
  state: string;
  reasoning: string[];
  confidence: ConfidenceLevel;
}

export function DomainCard({
  title,
  state,
  reasoning,
  confidence,
}: DomainCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium uppercase tracking-wider text-zinc-300">
          {title}
        </h4>
        <StatusBadge status={state} />
      </div>
      <div className="space-y-1.5">
        {reasoning.map((r, i) => (
          <p
            key={i}
            className="text-xs leading-relaxed text-zinc-400"
          >
            • {r}
          </p>
        ))}
      </div>
      <div className="mt-3 border-t border-zinc-800 pt-2">
        <span className="text-[10px] uppercase text-zinc-500">
          Confidence: {confidence}
        </span>
      </div>
    </div>
  );
}
