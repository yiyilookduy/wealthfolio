import { useQuery } from "@tanstack/react-query";
import { BackendApiClient } from "../lib/api-client";
import type {
  ReliabilityResponse,
  ReliabilityHistoryResponse,
} from "../lib/types";

interface ReliabilityData {
  status: ReliabilityResponse;
  history: ReliabilityHistoryResponse;
}

export function useReliability(baseUrl: string | null) {
  return useQuery<ReliabilityData>({
    queryKey: ["btc-intelligence", "reliability", baseUrl],
    queryFn: async () => {
      const client = new BackendApiClient(baseUrl!);
      const [status, history] = await Promise.all([
        client.getReliability(),
        client.getReliabilityHistory(30),
      ]);
      return { status, history };
    },
    enabled: !!baseUrl,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
