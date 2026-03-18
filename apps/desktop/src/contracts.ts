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
  settings: DesktopSettings;
  lastSyncError: string | null;
}
