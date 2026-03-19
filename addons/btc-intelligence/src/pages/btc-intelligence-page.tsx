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

export default function BtcIntelligencePage({
  ctx,
}: {
  ctx: AddonContext;
}) {
  const { url, isLoading, saveUrl, defaultUrl } = useBackendUrl(ctx);
  const [activeTab, setActiveTab] = useState<TabId>("regime");
  const [showSettings, setShowSettings] = useState(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: "regime", label: "Regime" },
    { id: "reliability", label: "Reliability" },
    { id: "report", label: "Report" },
  ];

  return (
    <Page>
      <PageHeader title="BTC Intelligence">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
        >
          ⚙️
        </Button>
      </PageHeader>
      <PageContent>
        <ConnectionGuard
          url={url}
          isLoading={isLoading}
          defaultUrl={defaultUrl}
          saveUrl={saveUrl}
        >
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-zinc-800 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-zinc-100 border-b-2 border-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content — placeholder until Tasks 5-7 */}
          {activeTab === "regime" && url && (
            <RegimeTab baseUrl={url} />
          )}
          {activeTab === "reliability" && url && (
            <ReliabilityTab baseUrl={url} />
          )}
          {activeTab === "report" && url && (
            <ReportTab baseUrl={url} />
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
