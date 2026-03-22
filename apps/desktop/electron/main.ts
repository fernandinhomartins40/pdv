import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import type { Product, SyncPushResponse, XmlImportPreview } from "@pdv/types";
import { LocalDatabase } from "./local-db";
import type { CloseCashSessionInput, DesktopSettings, OpenCashSessionInput } from "../src/contracts";

let localDb: LocalDatabase;

function getSyncSettings(): DesktopSettings {
  return localDb.getSettings();
}

async function requestJson<T>(pathname: string, init?: RequestInit, query?: Record<string, string>) {
  const settings = getSyncSettings();
  const url = new URL(`${settings.apiBaseUrl}${pathname}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (settings.sessionToken) {
    headers.set("Authorization", `Bearer ${settings.sessionToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers
  });

  if (!response.ok) {
    let message = `Falha HTTP ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Ignore parse errors and keep HTTP fallback.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

async function cancelSale(saleId: string) {
  const sale = localDb.getSaleSummary(saleId);
  if (!sale) {
    throw new Error("Venda local nao encontrada.");
  }

  if (sale.status === "CANCELLED") {
    return localDb.bootstrap();
  }

  if (sale.syncedAt) {
    await requestJson<{ id: string; status: "CANCELLED" }>(`/sales/${saleId}/cancel`, {
      method: "POST"
    });
  }

  localDb.cancelSale(saleId);
  return localDb.bootstrap();
}

async function previewXmlImport(xml: string, marginPercent?: number) {
  const settings = getSyncSettings();
  return requestJson<XmlImportPreview>(
    "/xml/preview",
    {
      method: "POST",
      body: JSON.stringify({
        organizationId: settings.organizationId,
        storeId: settings.storeId,
        xml,
        marginPercent
      })
    }
  );
}

async function importXml(xml: string, marginPercent?: number) {
  const settings = getSyncSettings();
  return requestJson<{
    accessKey: string;
    supplierName?: string;
    importedCount: number;
    createdCount: number;
    updatedCount: number;
  }>(
    "/xml/import",
    {
      method: "POST",
      body: JSON.stringify({
        organizationId: settings.organizationId,
        storeId: settings.storeId,
        xml,
        marginPercent
      })
    }
  );
}

async function syncNow() {
  const settings = getSyncSettings();
  const operations = localDb.getPendingOperations();
  let processed = 0;
  let conflicts = 0;

  if (operations.length > 0) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      if (settings.sessionToken) {
        headers.Authorization = `Bearer ${settings.sessionToken}`;
      }

      const response = await fetch(`${settings.apiBaseUrl}/sync/push`, {
        method: "POST",
        headers,
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

    const headers: Record<string, string> = {};
    if (settings.sessionToken) {
      headers.Authorization = `Bearer ${settings.sessionToken}`;
    }

    const response = await fetch(url, { headers });
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
  ipcMain.handle("open-cash-session", async (_, payload: OpenCashSessionInput) => localDb.openCashSession(payload));
  ipcMain.handle("close-cash-session", async (_, payload: CloseCashSessionInput) => localDb.closeCashSession(payload));
  ipcMain.handle("cancel-sale", async (_, saleId: string) => cancelSale(saleId));
  ipcMain.handle("sync-now", async () => syncNow());
  ipcMain.handle("pending-sync-count", async () => localDb.getPendingSyncCount());
  ipcMain.handle("save-settings", async (_, settings: DesktopSettings) => localDb.saveSettings(settings));
  ipcMain.handle("preview-xml-import", async (_, payload: { xml: string; marginPercent?: number }) =>
    previewXmlImport(payload.xml, payload.marginPercent)
  );
  ipcMain.handle("import-xml", async (_, payload: { xml: string; marginPercent?: number }) =>
    importXml(payload.xml, payload.marginPercent)
  );

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
