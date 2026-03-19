import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { BtcLatestResponse } from "../lib/types";

export function useBtcLatest(baseUrl: string | null) {
  return useQuery<BtcLatestResponse>({
    queryKey: ["btc-intelligence", "btc-latest", baseUrl],
    queryFn: () => new BackendApiClient(baseUrl!).getBtcLatest(),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
