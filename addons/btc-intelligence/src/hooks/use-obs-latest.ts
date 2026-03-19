import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { ObsSnapshotResponse } from "../lib/types";

export function useObsLatest(baseUrl: string | null) {
  return useQuery<ObsSnapshotResponse>({
    queryKey: ["btc-intelligence", "obs-latest", baseUrl],
    queryFn: () => new BackendApiClient(baseUrl!).getObsLatest(),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
