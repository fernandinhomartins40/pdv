import type { UserIdentity } from "@pdv/types";

export interface DesktopSettings {
  apiBaseUrl: string;
  terminalId: string;
  sessionToken: string;
  organizationId: string;
  storeId: string;
  operatorId: string;
  operatorName: string;
  operatorEmail: string;
}

export interface DesktopBootstrap {
  operator: UserIdentity;
  priceLabel: string;
  syncPending: number;
  cashSessionOpen: boolean;
  cashSession: DesktopCashSession | null;
  syncQueue: DesktopSyncQueueEntry[];
  recentSales: DesktopSaleSummary[];
  settings: DesktopSettings;
  lastSyncError: string | null;
}

export interface DesktopCashSession {
  id: string;
  openedAt: string;
  openingAmount: number;
  cashSalesAmount: number;
  expectedAmount: number;
  status: "OPEN" | "CLOSED";
}

export interface DesktopSyncQueueEntry {
  id: string;
  entity: string;
  operation: string;
  status: string;
  attempts: number;
  lastError: string | null;
  scheduledAt: string;
  createdAt: string;
}

export interface DesktopSaleSummary {
  id: string;
  status: "COMPLETED" | "CANCELLED";
  itemCount: number;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  syncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpenCashSessionInput {
  operatorId: string;
  openingAmount: number;
}

export interface CloseCashSessionInput {
  operatorId: string;
  closingAmount: number;
}
