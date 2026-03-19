import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { type AddonContext } from "@wealthfolio/addon-sdk";
import React from "react";

// Lazy-load the main page
const BtcIntelligencePage = React.lazy(
  () => import("./pages/btc-intelligence-page"),
);

export default function enable(ctx: AddonContext) {
  ctx.api.logger.info("₿ BTC Intelligence addon is being enabled");

  const addedItems: Array<{ remove: () => void }> = [];

  try {
    // Sidebar item
    const sidebarItem = ctx.sidebar.addItem({
      id: "btc-intelligence",
      label: "BTC Intelligence",
      icon: "₿",
      route: "/addon/btc-intelligence",
      order: 100,
    });
    addedItems.push(sidebarItem);

    // Wrapper with QueryClientProvider
    const PageWrapper = () => {
      const sharedQueryClient = ctx.api.query.getClient() as QueryClient;
      return (
        <QueryClientProvider client={sharedQueryClient}>
          <BtcIntelligencePage ctx={ctx} />
        </QueryClientProvider>
      );
    };

    // Register route
    ctx.router.add({
      path: "/addon/btc-intelligence",
      component: React.lazy(() =>
        Promise.resolve({ default: PageWrapper }),
      ),
    });

    ctx.api.logger.info("₿ BTC Intelligence addon enabled successfully");
  } catch (error) {
    ctx.api.logger.error(
      "Failed to initialize BTC Intelligence addon: " +
        (error as Error).message,
    );
    throw error;
  }

  // Cleanup
  ctx.onDisable(() => {
    ctx.api.logger.info("₿ BTC Intelligence addon is being disabled");
    addedItems.forEach((item) => {
      try {
        item.remove();
      } catch {
        // ignore cleanup errors
      }
    });
  });
}
