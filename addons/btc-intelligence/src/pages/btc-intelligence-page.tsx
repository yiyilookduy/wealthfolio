import { useState } from "react";
import { type AddonContext } from "@wealthfolio/addon-sdk";
import { Page, PageHeader, PageContent, Button } from "@wealthfolio/ui";
import { useBackendUrl } from "../hooks/use-backend-url";
import { ConnectionGuard } from "../components/connection-guard";
import { SettingsDialog } from "../components/settings-dialog";
import { RegimeTab } from "../components/regime-tab";
import { ReliabilityTab } from "../components/reliability-tab";
import { ReportTab } from "../components/report-tab";

type TabId = "regime" | "reliability" | "report";

const TABS: { id: TabId; label: string }[] = [
  { id: "regime", label: "Regime" },
  { id: "reliability", label: "Reliability" },
  { id: "report", label: "Report" },
];

export default function BtcIntelligencePage({
  ctx,
}: {
  ctx: AddonContext;
}) {
  const { url, isLoading, saveUrl, defaultUrl } = useBackendUrl(ctx);
  const [activeTab, setActiveTab] = useState<TabId>("regime");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Page>
      <PageHeader
        heading="BTC Intelligence"
        text="Observability dashboard"
        actions={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            ⚙️
          </Button>
        }
      />
      <PageContent>
        <ConnectionGuard
          url={url}
          isLoading={isLoading}
          defaultUrl={defaultUrl}
          saveUrl={saveUrl}
        >
          {/* Tab bar */}
          <div className="mb-6 flex gap-1 border-b border-zinc-800">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-zinc-100" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "regime" && url && (
            <RegimeTab baseUrl={url} onOpenSettings={() => setShowSettings(true)} />
          )}
          {activeTab === "reliability" && url && (
            <ReliabilityTab baseUrl={url} onOpenSettings={() => setShowSettings(true)} />
          )}
          {activeTab === "report" && url && (
            <ReportTab baseUrl={url} onOpenSettings={() => setShowSettings(true)} />
          )}
        </ConnectionGuard>

        {showSettings && url && (
          <SettingsDialog
            currentUrl={url}
            defaultUrl={defaultUrl}
            onSave={saveUrl}
            onClose={() => setShowSettings(false)}
          />
        )}
      </PageContent>
    </Page>
  );
}

