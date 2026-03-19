import type {
  BackendHealthResponse,
  BtcLatestResponse,
  HealthResponse,
  ObsSnapshotResponse,
  ReliabilityHistoryResponse,
  ReliabilityResponse,
  ReportResponse,
  RunHistoryResponse,
  SynthesisResponse,
} from "./types";

export class BackendApiClient {
  constructor(private baseUrl: string) {
    // Remove trailing slash
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`API ${path}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Connection test
  async checkHealth(): Promise<BackendHealthResponse> {
    return this.get("/api/v1/health");
  }

  // Regime tab
  async getBtcLatest(): Promise<BtcLatestResponse> {
    return this.get("/api/v1/btc/latest");
  }

  async getSynthesis(): Promise<SynthesisResponse> {
    return this.get("/api/v1/obs/synthesis");
  }

  async getObsHealth(): Promise<HealthResponse> {
    return this.get("/api/v1/obs/health");
  }

  // Reliability tab
  async getReliability(): Promise<ReliabilityResponse> {
    return this.get("/api/v1/admin/reliability");
  }

  async getReliabilityHistory(
    days: number = 30,
  ): Promise<ReliabilityHistoryResponse> {
    return this.get(`/api/v1/admin/reliability/history?days=${days}`);
  }

  // Report tab
  async getReport(): Promise<ReportResponse> {
    return this.get("/api/v1/obs/report");
  }

  // Raw obs snapshot
  async getObsLatest(): Promise<ObsSnapshotResponse> {
    return this.get("/api/v1/obs/latest");
  }

  // Run history
  async getRuns(limit: number = 14): Promise<RunHistoryResponse> {
    return this.get(`/api/v1/obs/runs?limit=${limit}`);
  }
}
