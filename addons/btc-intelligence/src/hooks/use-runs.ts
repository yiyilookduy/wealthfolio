import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { RunHistoryResponse } from "../lib/types";

export function useRuns(baseUrl: string | null, limit: number = 14) {
  return useQuery<RunHistoryResponse>({
    queryKey: ["btc-intelligence", "runs", baseUrl, limit],
    queryFn: () => new BackendApiClient(baseUrl!).getRuns(limit),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
