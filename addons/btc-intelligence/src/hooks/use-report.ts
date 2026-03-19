import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { ReportResponse } from "../lib/types";

export function useReport(baseUrl: string | null) {
  return useQuery<ReportResponse>({
    queryKey: ["btc-intelligence", "report", baseUrl],
    queryFn: () => new BackendApiClient(baseUrl!).getReport(),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
