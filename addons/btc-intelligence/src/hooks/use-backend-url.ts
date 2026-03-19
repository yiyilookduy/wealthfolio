import { useState, useEffect, useCallback } from "react";
import type { AddonContext } from "@wealthfolio/addon-sdk";

const SECRET_KEY = "backend-url";
const DEFAULT_URL = "http://192.168.1.103:8000";

export function useBackendUrl(ctx: AddonContext) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ctx.api.secrets
      .get(SECRET_KEY)
      .then((saved) => {
        setUrl(saved ?? null);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [ctx]);

  const saveUrl = useCallback(
    async (newUrl: string) => {
      await ctx.api.secrets.set(SECRET_KEY, newUrl);
      setUrl(newUrl);
    },
    [ctx],
  );

  const clearUrl = useCallback(async () => {
    await ctx.api.secrets.delete(SECRET_KEY);
    setUrl(null);
  }, [ctx]);

  return { url, isLoading, saveUrl, clearUrl, defaultUrl: DEFAULT_URL };
}
