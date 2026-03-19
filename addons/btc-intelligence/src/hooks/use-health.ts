import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { HealthResponse } from "../lib/types";

export function useHealth(baseUrl: string | null) {
  return useQuery<HealthResponse>({
    queryKey: ["btc-intelligence", "health", baseUrl],
    queryFn: () => new BackendApiClient(baseUrl!).getObsHealth(),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
