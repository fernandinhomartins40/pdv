import { contextBridge, ipcRenderer } from "electron";
import type { DesktopSettings } from "../src/contracts";

contextBridge.exposeInMainWorld("pdv", {
  bootstrap: () => ipcRenderer.invoke("bootstrap"),
  searchProducts: (query: string) => ipcRenderer.invoke("search-products", query),
  saveSale: (payload: unknown) => ipcRenderer.invoke("save-sale", payload),
  toggleCashSession: (operatorId: string) => ipcRenderer.invoke("toggle-cash-session", operatorId),
  syncNow: () => ipcRenderer.invoke("sync-now"),
  getPendingSyncCount: () => ipcRenderer.invoke("pending-sync-count"),
  saveSettings: (settings: DesktopSettings) => ipcRenderer.invoke("save-settings", settings)
});
