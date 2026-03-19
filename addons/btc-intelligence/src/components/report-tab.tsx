import type React from "react";
import { StatusBadge } from "./status-badge";
import { DomainCard } from "./domain-card";
import { useReport } from "../hooks/use-report";
import type { ConfidenceLevel } from "../lib/types";

interface ReportTabProps {
  baseUrl: string;
}

export function ReportTab({ baseUrl }: ReportTabProps) {
  const { data, isLoading, error, refetch } = useReport(baseUrl);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-zinc-500">
        Loading report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-400">
        {error.message}
        <button
          onClick={() => refetch()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Executive summary */}
      <Section title="Executive Summary">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Quality Tier"
            value={data.executive.data_quality_tier ?? "—"}
          />
          <Stat
            label="Confidence"
            value={data.executive.overall_confidence}
          />
          <Stat
            label="Issues"
            value={String(data.executive.issue_count)}
          />
          <Stat
            label="Stale Metrics"
            value={String(data.executive.stale_metric_count)}
          />
        </div>
        {data.executive.has_conflicts && (
          <p className="mt-2 text-xs text-yellow-400">
            ⚠ Domain conflicts detected
          </p>
        )}
      </Section>

      {/* Synthesis — reuse DomainCard */}
      <Section title="Domain Synthesis">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DomainCard
            title="Valuation"
            state={data.synthesis.valuation_state}
            reasoning={data.synthesis.valuation_reasoning}
            confidence={
              data.synthesis.overall_confidence as ConfidenceLevel
            }
          />
          <DomainCard
            title="Leverage"
            state={data.synthesis.leverage_state}
            reasoning={data.synthesis.leverage_reasoning}
            confidence={
              data.synthesis.overall_confidence as ConfidenceLevel
            }
          />
          <DomainCard
            title="Macro"
            state={data.synthesis.macro_state}
            reasoning={data.synthesis.macro_reasoning}
            confidence={
              data.synthesis.overall_confidence as ConfidenceLevel
            }
          />
        </div>
      </Section>

      {/* Changes */}
      {data.changes.has_diff && (
        <Section title="Recent Changes">
          <p className="text-xs text-zinc-400">
            {data.changes.total_metrics_changed} metrics changed
            since {data.changes.previous_date}
          </p>
        </Section>
      )}

      {/* Issues */}
      <Section title={`Issues (${data.issues.total_count})`}>
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
            No long-standing issues
          </p>
        )}
      </Section>

      {/* Journal highlights */}
      {data.journal_highlights.length > 0 && (
        <Section title="Journal Highlights">
          {data.journal_highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1 text-xs"
            >
              <StatusBadge status={h.severity} />
              <span className="text-zinc-300">{h.detail}</span>
              <span className="ml-auto text-zinc-500">{h.as_of}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Caveats */}
      {data.caveats.length > 0 && (
        <Section title="Data Caveats">
          {data.caveats.map((c, i) => (
            <p key={i} className="text-xs text-yellow-400/80">
              ⚠ {c}
            </p>
          ))}
        </Section>
      )}

      <p className="text-[10px] text-zinc-600">
        Report v{data.report_version} · as of {data.as_of}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h3 className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase text-zinc-500">{label}</p>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}
