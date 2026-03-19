import { useState } from "react";
import { Button, Input, Label } from "@wealthfolio/ui";
import { BackendApiClient } from "../lib/api-client";

interface ConnectionGuardProps {
  url: string | null;
  isLoading: boolean;
  defaultUrl: string;
  saveUrl: (url: string) => Promise<void>;
  children: React.ReactNode;
}

export function ConnectionGuard({
  url,
  isLoading,
  defaultUrl,
  saveUrl,
  children,
}: ConnectionGuardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-zinc-500">Loading configuration...</p>
      </div>
    );
  }

  // First-time setup: inline form (NOT modal overlay — nothing behind to dim)
  if (!url) {
    return (
      <div className="mx-auto max-w-md py-20">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="text-lg font-semibold text-zinc-100">
            Connect to Backend
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Enter your YIYI Capital FastAPI backend URL to get started.
          </p>
          <SetupForm defaultUrl={defaultUrl} onSave={saveUrl} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Inline setup form — no overlay, no fixed positioning
function SetupForm({
  defaultUrl,
  onSave,
}: {
  defaultUrl: string;
  onSave: (url: string) => Promise<void>;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const client = new BackendApiClient(url);
      const health = await client.checkHealth();
      setTestResult({
        ok: true,
        message: `Connected! Backend v${health.version}, status: ${health.status}`,
      });
    } catch (err) {
      setTestResult({
        ok: false,
        message: `Failed: ${(err as Error).message}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div>
        <Label htmlFor="setup-backend-url">Backend URL</Label>
        <Input
          id="setup-backend-url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setTestResult(null);
          }}
          placeholder={defaultUrl}
          className="mt-1"
        />
      </div>

      {testResult && (
        <p
          className={`text-sm ${testResult.ok ? "text-emerald-400" : "text-red-400"}`}
        >
          {testResult.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={testing || !url}
        >
          {testing ? "Testing..." : "Test Connection"}
        </Button>
        <Button onClick={() => onSave(url)} disabled={!url}>
          Save & Connect
        </Button>
      </div>
    </div>
  );
}
