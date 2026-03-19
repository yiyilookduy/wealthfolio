import { useState } from "react";
import { Button, Input, Label } from "@wealthfolio/ui";
import { BackendApiClient } from "../lib/api-client";

interface SettingsDialogProps {
  currentUrl: string;
  defaultUrl: string;
  onSave: (url: string) => Promise<void>;
  onClose: () => void;
}

export function SettingsDialog({
  currentUrl,
  defaultUrl,
  onSave,
  onClose,
}: SettingsDialogProps) {
  const [url, setUrl] = useState(currentUrl || defaultUrl);
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

  const handleSave = async () => {
    await onSave(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">
          Backend Configuration
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          Enter the URL of your YIYI Capital FastAPI backend.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="backend-url">Backend URL</Label>
            <Input
              id="backend-url"
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
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !url}
          >
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={handleSave} disabled={!url}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
