/// <reference types="vite/client" />

import type { PaymentMethod, Product, XmlImportPreview } from "@pdv/types";
import type {
  CloseCashSessionInput,
  DesktopBootstrap,
  DesktopSettings,
  OpenCashSessionInput
} from "./contracts";

interface LocalSalePayload {
  operatorId: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    totalAmount: number;
  }>;
  payments: Array<{
    method: PaymentMethod;
    amount: number;
    reference?: string | null;
  }>;
}

interface DesktopBridge {
  bootstrap(): Promise<DesktopBootstrap>;
  searchProducts(query: string): Promise<Product[]>;
  saveSale(payload: LocalSalePayload): Promise<{ saleId: string; syncPending: number }>;
  toggleCashSession(operatorId: string): Promise<{ status: "OPEN" | "CLOSED"; syncPending: number }>;
  openCashSession(payload: OpenCashSessionInput): Promise<{ status: "OPEN"; syncPending: number }>;
  closeCashSession(payload: CloseCashSessionInput): Promise<{ status: "CLOSED"; syncPending: number }>;
  cancelSale(saleId: string): Promise<DesktopBootstrap>;
  syncNow(): Promise<{ processed: number; conflicts: number; syncPending: number }>;
  getPendingSyncCount(): Promise<number>;
  saveSettings(settings: DesktopSettings): Promise<DesktopBootstrap>;
  previewXmlImport(xml: string, marginPercent?: number): Promise<XmlImportPreview>;
  importXml(xml: string, marginPercent?: number): Promise<{
    accessKey: string;
    supplierName?: string;
    importedCount: number;
    createdCount: number;
    updatedCount: number;
  }>;
}

declare global {
  interface Window {
    pdv: DesktopBridge;
  }
}

export {};
