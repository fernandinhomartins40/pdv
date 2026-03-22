import { contextBridge, ipcRenderer } from "electron";
import type { DesktopSettings } from "../src/contracts";

contextBridge.exposeInMainWorld("pdv", {
  bootstrap: () => ipcRenderer.invoke("bootstrap"),
  searchProducts: (query: string) => ipcRenderer.invoke("search-products", query),
  saveSale: (payload: unknown) => ipcRenderer.invoke("save-sale", payload),
  toggleCashSession: (operatorId: string) => ipcRenderer.invoke("toggle-cash-session", operatorId),
  openCashSession: (payload: unknown) => ipcRenderer.invoke("open-cash-session", payload),
  closeCashSession: (payload: unknown) => ipcRenderer.invoke("close-cash-session", payload),
  cancelSale: (saleId: string) => ipcRenderer.invoke("cancel-sale", saleId),
  syncNow: () => ipcRenderer.invoke("sync-now"),
  getPendingSyncCount: () => ipcRenderer.invoke("pending-sync-count"),
  saveSettings: (settings: DesktopSettings) => ipcRenderer.invoke("save-settings", settings),
  previewXmlImport: (xml: string, marginPercent?: number) => ipcRenderer.invoke("preview-xml-import", { xml, marginPercent }),
  importXml: (xml: string, marginPercent?: number) => ipcRenderer.invoke("import-xml", { xml, marginPercent })
});
