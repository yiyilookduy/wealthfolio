import type React from "react";
import { StatusBadge } from "./status-badge";
import { DomainCard } from "./domain-card";
import { useReport } from "../hooks/use-report";
import type { ConfidenceLevel } from "../lib/types";

interface ReportTabProps {
  baseUrl: string;
  onOpenSettings?: () => void;
}

function isStale(dateStr: string | undefined | null, hoursThreshold = 24): boolean {
  if (!dateStr) return false;
  try {
    const ts = new Date(dateStr).getTime();
    return Date.now() - ts > hoursThreshold * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/** Severity → left border color for journal entries */
const SEVERITY_BORDER: Record<string, string> = {
  positive: "border-l-emerald-500",
  notable: "border-l-yellow-500",
  warning: "border-l-red-500",
  info: "border-l-blue-500",
};

export function ReportTab({ baseUrl, onOpenSettings }: ReportTabProps) {
  const { data, isLoading, error, refetch } = useReport(baseUrl);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6 text-center">
          <p className="text-2xl">⚠️</p>
          <p className="mt-2 text-sm font-medium text-red-400">Failed to load report</p>
          <p className="mt-1 text-xs text-zinc-500">{error.message}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => refetch()}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Retry
            </button>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Check Settings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const reportIsStale = isStale(data.as_of);

  return (
    <div className="space-y-5">
      {/* Executive summary — hero-level card with larger visual weight */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/50 p-6">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Executive Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HeroStat
            label="Quality Tier"
            value={data.executive.data_quality_tier ?? "—"}
            color={
              data.executive.data_quality_tier === "good"
                ? "text-emerald-400"
                : data.executive.data_quality_tier === "partial"
                  ? "text-yellow-400"
                  : "text-zinc-200"
            }
          />
          <HeroStat
            label="Confidence"
            value={data.executive.overall_confidence}
            color={
              data.executive.overall_confidence === "high"
                ? "text-emerald-400"
                : data.executive.overall_confidence === "medium"
                  ? "text-yellow-400"
                  : "text-red-400"
            }
          />
          <HeroStat
            label="Issues"
            value={String(data.executive.issue_count)}
            color={data.executive.issue_count > 0 ? "text-yellow-400" : "text-emerald-400"}
          />
          <HeroStat
            label="Stale Metrics"
            value={String(data.executive.stale_metric_count)}
            color={data.executive.stale_metric_count > 0 ? "text-yellow-400" : "text-emerald-400"}
          />
        </div>
        {data.executive.has_conflicts && (
          <p className="mt-3 rounded-md bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-400">
            ⚠ Domain conflicts detected
          </p>
        )}
      </div>

      {/* Synthesis — reuse DomainCard */}
      <Section title="Domain Synthesis">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DomainCard
            title="Valuation"
            state={data.synthesis.valuation_state}
            reasoning={data.synthesis.valuation_reasoning}
            confidence={data.synthesis.overall_confidence as ConfidenceLevel}
          />
          <DomainCard
            title="Leverage"
            state={data.synthesis.leverage_state}
            reasoning={data.synthesis.leverage_reasoning}
            confidence={data.synthesis.overall_confidence as ConfidenceLevel}
          />
          <DomainCard
            title="Macro"
            state={data.synthesis.macro_state}
            reasoning={data.synthesis.macro_reasoning}
            confidence={data.synthesis.overall_confidence as ConfidenceLevel}
          />
        </div>
      </Section>

      {/* Changes + Issues in 2-col layout to reduce vertical scroll */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.changes.has_diff && (
          <Section title="Recent Changes" compact>
            <p className="text-sm font-semibold text-zinc-200">
              {data.changes.total_metrics_changed}{" "}
              <span className="text-xs font-normal text-zinc-400">
                metrics changed since {data.changes.previous_date}
              </span>
            </p>
          </Section>
        )}
        <Section title={`Issues (${data.issues.total_count})`} compact>
          {data.issues.long_standing_issues.length > 0 ? (
            data.issues.long_standing_issues.map((issue, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-1 text-xs"
              >
                <span className="text-zinc-500">
                  {issue.layer}.{issue.metric}
                </span>
                <StatusBadge status={issue.issue_type} />
                <span className="text-zinc-400">
                  streak: {issue.streak}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500">
              No long-standing issues ✓
            </p>
          )}
        </Section>
      </div>

      {/* Journal highlights — severity-aware left border */}
      {data.journal_highlights.length > 0 && (
        <Section title="Journal Highlights">
          <div className="space-y-1">
            {data.journal_highlights.map((h, i) => {
              const displayText =
                h.detail ||
                `${h.layer}.${h.metric} — ${h.type.replace(/_/g, " ")}`;
              const borderColor =
                SEVERITY_BORDER[h.severity.toLowerCase()] ?? "border-l-zinc-600";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-md border-l-2 ${borderColor} bg-zinc-900/30 px-3 py-1.5 text-xs transition-colors hover:bg-zinc-800/30`}
                >
                  <StatusBadge status={h.severity} />
                  <span className="text-zinc-300">{displayText}</span>
                  <span className="ml-auto shrink-0 text-zinc-600">
                    {h.as_of}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Caveats */}
      {data.caveats.length > 0 && (
        <Section title="Data Caveats" compact>
          {data.caveats.map((c, i) => (
            <p key={i} className="text-xs text-yellow-500/70">
              ⚠ {c}
            </p>
          ))}
        </Section>
      )}

      <p className="text-[10px] text-zinc-600">
        Report v{data.report_version} · as of {data.as_of}
        {reportIsStale && (
          <span className="ml-2 rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-400">
            ⚠ Data may be stale
          </span>
        )}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
  compact = false,
}: {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 ${compact ? "p-3" : "p-4"}`}>
      <h3 className={`${compact ? "mb-2" : "mb-3"} text-xs font-semibold uppercase tracking-wider text-zinc-500`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function HeroStat({
  label,
  value,
  color = "text-zinc-200",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-800/30 px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">{label}</p>
      <p className={`mt-0.5 text-lg font-bold capitalize ${color}`}>{value}</p>
    </div>
  );
}
