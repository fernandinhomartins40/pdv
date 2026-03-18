/// <reference types="vite/client" />

import type { PaymentMethod, Product, UserIdentity } from "@pdv/types";
import type { DesktopBootstrap, DesktopSettings } from "./contracts";

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
  syncNow(): Promise<{ processed: number; conflicts: number; syncPending: number }>;
  getPendingSyncCount(): Promise<number>;
  saveSettings(settings: DesktopSettings): Promise<DesktopBootstrap>;
}

declare global {
  interface Window {
    pdv: DesktopBridge;
  }
}

export {};
