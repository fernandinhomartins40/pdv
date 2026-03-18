import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import type { Product, SyncPushResponse } from "@pdv/types";
import { LocalDatabase } from "./local-db";
import type { DesktopSettings } from "../src/contracts";

let localDb: LocalDatabase;

function getSyncSettings(): DesktopSettings {
  return localDb.getSettings();
}

async function syncNow() {
  const settings = getSyncSettings();
  const operations = localDb.getPendingOperations();
  let processed = 0;
  let conflicts = 0;

  if (operations.length > 0) {
    try {
      const response = await fetch(`${settings.apiBaseUrl}/sync/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          organizationId: settings.organizationId,
          storeId: settings.storeId,
          operations
        })
      });

      if (!response.ok) {
        throw new Error(`Falha HTTP ${response.status}`);
      }

      const result = (await response.json()) as SyncPushResponse;
      localDb.markSyncProcessed(result.processedIds);
      processed = result.processedIds.length;
      conflicts = result.conflicts.length;

      for (const conflict of result.conflicts) {
        localDb.markSyncConflict(conflict.queueId, conflict.reason);
      }
    } catch (error) {
      for (const operation of operations) {
        const delayMs = Math.min(60000, 5000 * 2 ** Math.max(operation.attempts, 0));
        localDb.markSyncFailed(
          operation.id,
          operation.attempts + 1,
          error instanceof Error ? error.message : "Falha desconhecida no sync.",
          delayMs
        );
      }
    }
  }

  try {
    const cursor = localDb.getCursor();
    const url = new URL(`${settings.apiBaseUrl}/sync/pull`);
    url.searchParams.set("organizationId", settings.organizationId);
    url.searchParams.set("storeId", settings.storeId);
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status}`);
    }

    const result = (await response.json()) as {
      cursor: string;
      products: Product[];
      stock: Array<{ productId: string; quantity: number }>;
    };

    localDb.applyRemoteProducts(result.products);
    localDb.applyRemoteStock(result.stock);
    localDb.setCursor(result.cursor);
  } catch (error) {
    localDb.setSyncError(error instanceof Error ? error.message : "Falha ao receber dados da nuvem.");
  }

  return {
    processed,
    conflicts,
    syncPending: localDb.getPendingSyncCount()
  };
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    backgroundColor: "#42107B",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (!app.isPackaged && devServerUrl) {
    void window.loadURL(devServerUrl);
    return;
  }

  void window.loadFile(path.join(app.getAppPath(), "dist", "index.html"));
}

async function bootstrap() {
  await app.whenReady();
  app.setAppUserModelId("br.com.pdv.desktop");

  localDb = new LocalDatabase(path.join(app.getPath("userData"), "pdv-local.db"));
  localDb.init();

  ipcMain.handle("bootstrap", async () => localDb.bootstrap());
  ipcMain.handle("search-products", async (_, query: string) => localDb.searchProducts(query));
  ipcMain.handle("save-sale", async (_, payload: Parameters<LocalDatabase["saveSale"]>[0]) => localDb.saveSale(payload));
  ipcMain.handle("toggle-cash-session", async (_, operatorId: string) => localDb.toggleCashSession(operatorId));
  ipcMain.handle("sync-now", async () => syncNow());
  ipcMain.handle("pending-sync-count", async () => localDb.getPendingSyncCount());
  ipcMain.handle("save-settings", async (_, settings: DesktopSettings) => localDb.saveSettings(settings));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

void bootstrap();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
