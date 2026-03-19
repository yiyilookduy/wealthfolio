import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type { SynthesisResponse } from "../lib/types";

export function useSynthesis(baseUrl: string | null) {
  return useQuery<SynthesisResponse>({
    queryKey: ["btc-intelligence", "synthesis", baseUrl],
    queryFn: () => new BackendApiClient(baseUrl!).getSynthesis(),
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
