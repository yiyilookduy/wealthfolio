// ────────────────────────────────────────────────
// BTC Intelligence Addon — Backend API Types
// Matches YIYI FastAPI response shapes exactly
// ────────────────────────────────────────────────

// --- GET /api/v1/btc/latest ---
export interface BtcLatestResponse {
  asset_id: string;
  snapshot_date: string;
  engine_version: string;
  schema_version: string;
  payload: BtcSnapshot;
  updated_at: string;
}

export interface BtcSnapshot {
  date: string;
  close: number;
  regime: {
    code: number;
    name: string; // "Decline" | "Accumulation" | "Advance" | "Distribution"
    vol_regime: number;
    price_regime: number;
    trend_basis: number;
    atr_value: number;
  };
  onchain: {
    mvrv_zscore: number;
    mvrv_zone: string;
    nupl_value: number;
    nupl_zone: string;
    ssr_zscore: number;
    ssr_zone: string;
    buy_score: number;
    sell_score: number;
    is_whipsaw_risk: boolean;
    is_slow_bleed_risk: boolean;
    mvrv_zscore_ath: number;
    nupl_ath: number;
  };
  directive: {
    action: string; // "LIQUIDITY PRESERVATION" | "CAUTIOUS ACCUMULATION" | etc
    confidence: string;
  };
  uncertainty: {
    level: string; // "high" | "medium" | "low"
    main_conflict: string;
    what_would_change_this_view: string[];
    data_caveat: string;
  };
  decision_attribution: {
    primary_driver: string;
    secondary_driver: string;
    summary: string;
    supports: string[];
    opposes: string[];
  };
  daily_overlay: {
    bar_confirmed: boolean;
    date: string;
    status: string;
    relation_to_weekly: string;
    execution_bias: string;
    metrics: Record<string, number>;
    summary: string;
  };
  meta: {
    bar_confirmed: boolean;
    generated_at: string;
    data_quality: {
      price_ok: boolean;
      onchain_ok: boolean;
    };
  };
}

// --- GET /api/v1/obs/synthesis ---
export interface SynthesisResponse {
  synthesis_version: string;
  as_of: string;
  valuation_state: DomainState;
  valuation_reasoning: string[];
  valuation_confidence: ConfidenceLevel;
  leverage_state: DomainState;
  leverage_reasoning: string[];
  leverage_confidence: ConfidenceLevel;
  macro_state: DomainState;
  macro_reasoning: string[];
  macro_confidence: ConfidenceLevel;
  overall_confidence: ConfidenceLevel;
  data_quality_tier: string | null;
  caveats: string[];
  conflicts: string[];
  unavailable_domains: string[];
}

export type DomainState =
  | "supportive"
  | "neutral"
  | "stretched"
  | "cool"
  | "warming"
  | "elevated"
  | "mixed"
  | "restrictive"
  | "unavailable";

export type ConfidenceLevel = "high" | "medium" | "low";

// --- GET /api/v1/obs/health ---
export interface HealthResponse {
  engine_status: string;
  last_run: {
    run_id: string;
    started_at: string;
    completed_at: string;
    status: string;
    trigger: string;
    validity_tier: string;
    issues_count: number;
    total_latency_ms: number;
  } | null;
  consecutive_failures: number;
  stale_sources: string[];
  scheduler: {
    enabled: boolean;
    cron_hour: number;
    cron_minute: number;
    next_scheduled_run: string | null;
    last_run_time: string | null;
    total_scheduled_runs: number;
  };
  runtime_stats: {
    process_uptime_hours: number;
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    consecutive_successes: number;
    consecutive_all_successes: number;
    last_success_at: string | null;
    first_run_at: string | null;
  };
}

// --- GET /api/v1/admin/reliability ---
export interface ReliabilityResponse {
  checked_at: string | null;
  obs_status: TrafficLight;
  regime_status: TrafficLight;
  cron_status: TrafficLight;
  overall_status: TrafficLight;
  consecutive_green: number;
  best_streak: number;
  streak_start: string | null;
  issues: ReliabilityIssue[];
  details: {
    obs: Record<string, unknown>;
    regime: Record<string, unknown>;
    cron: Record<string, unknown>;
  };
}

export type TrafficLight = "green" | "yellow" | "red" | "unknown";

export interface ReliabilityIssue {
  system: string;
  severity: string;
  title: string;
  detail: string;
}

// --- GET /api/v1/admin/reliability/history ---
export interface ReliabilityHistoryResponse {
  days: { date: string; status: TrafficLight }[];
  summary: { green: number; yellow: number; red: number; no_data: number };
}

// --- GET /api/v1/obs/report ---
export interface ReportResponse {
  report_version: string;
  as_of: string;
  generated_at: string;
  executive: {
    data_quality_tier: string | null;
    stale_metric_count: number;
    issue_count: number;
    domain_states: Record<string, string>;
    overall_confidence: ConfidenceLevel;
    unavailable_domains: string[];
    has_conflicts: boolean;
  };
  synthesis: {
    valuation_state: string;
    valuation_reasoning: string[];
    leverage_state: string;
    leverage_reasoning: string[];
    macro_state: string;
    macro_reasoning: string[];
    overall_confidence: string;
    conflicts: string[];
  };
  changes: {
    has_diff: boolean;
    previous_date?: string;
    total_metrics_changed?: number;
    has_notable_changes?: boolean;
    note?: string;
  };
  issues: {
    total_count: number;
    by_type: Record<string, number>;
    lifecycle_active: number;
    long_standing_issues: {
      layer: string;
      metric: string;
      issue_type: string;
      streak: number;
      first_seen: string;
    }[];
  };
  journal_highlights: {
    as_of: string;
    type: string;
    severity: string;
    layer: string;
    metric: string;
    detail: string;
  }[];
  caveats: string[];
}

// --- GET /api/v1/health ---
export interface BackendHealthResponse {
  status: string;
  version: string;
  db_initialized: boolean;
  last_journal_sync: string | null;
  timestamp: string;
}

// --- GET /api/v1/obs/latest ---
export type ObsSnapshotResponse = Record<string, unknown>;

// --- GET /api/v1/obs/runs ---
export interface RunHistoryResponse {
  runs: RunEntry[];
  count: number;
}

export interface RunEntry {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  trigger: string;
  validity_tier: string;
  issues_count: number;
  total_latency_ms: number | null;
}
