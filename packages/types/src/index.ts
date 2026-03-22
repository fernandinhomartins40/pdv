export type CurrencyAmount = number;

export type SaleStep = "NEW_SALE" | "PAYMENT" | "FINALIZE";

export type PaymentMethod =
  | "CASH"
  | "CHECK"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "STORE_CREDIT"
  | "FOOD_VOUCHER"
  | "MEAL_VOUCHER"
  | "GIFT_VOUCHER"
  | "FUEL_VOUCHER"
  | "OTHER"
  | "PIX"
  | "CASHBACK"
  | "MERCADO_PAGO";

export type SyncEntity = "product" | "sale" | "stock" | "cash_session";

export type SyncOperationType =
  | "UPSERT_PRODUCT"
  | "UPSERT_STOCK"
  | "CREATE_SALE"
  | "OPEN_CASH_SESSION"
  | "CLOSE_CASH_SESSION";

export type SyncStatus = "PENDING" | "PROCESSING" | "FAILED" | "SYNCED" | "CONFLICT";

export interface UserIdentity {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "CASHIER" | "MANAGER" | "FINANCE" | "SUPPORT";
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  role: UserIdentity["role"];
}

export interface StoreSummary {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  role: UserIdentity["role"];
}

export interface TerminalSummary {
  id: string;
  organizationId: string;
  storeId: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface AuthSessionSummary {
  token: string;
  expiresAt: string;
}

export interface AuthContext {
  user: UserIdentity;
  organizations: OrganizationSummary[];
  stores: StoreSummary[];
  terminals: TerminalSummary[];
  activeOrganizationId: string;
  activeStoreId?: string | null;
  activeTerminalId?: string | null;
  session: AuthSessionSummary;
  emailVerified: boolean;
}

export interface RegisterAccountInput {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  organizationSlug?: string;
  storeName: string;
  storeCode?: string;
  terminalName: string;
  terminalCode?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  organizationId?: string;
  storeId?: string;
  terminalId?: string;
}

export interface SwitchContextInput {
  organizationId: string;
  storeId?: string;
  terminalId?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  unit: string;
  costPrice: number;
  salePrice: number;
  stockQuantity: number;
  minStock: number;
  ncm?: string | null;
  cfop?: string | null;
  isActive: boolean;
  updatedAt: string;
  version: number;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalAmount: number;
}

export interface SalePayment {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string | null;
}

export interface Sale {
  id: string;
  storeId: string;
  operatorId: string;
  status: "OPEN" | "COMPLETED" | "CANCELLED";
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  items: SaleItem[];
  payments: SalePayment[];
  syncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface CashSession {
  id: string;
  openedById: string;
  openedAt: string;
  closedAt?: string | null;
  openingAmount: number;
  closingAmount?: number | null;
  status: "OPEN" | "CLOSED";
}

export interface SyncQueueItem<TPayload = unknown> {
  id: string;
  entity: SyncEntity;
  operation: SyncOperationType;
  payload: TPayload;
  status: SyncStatus;
  attempts: number;
  scheduledAt: string;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncConflict {
  queueId: string;
  entity: SyncEntity;
  localVersion: number;
  remoteVersion: number;
  reason: string;
}

export interface SyncPushRequest {
  storeId: string;
  operations: SyncQueueItem[];
}

export interface SyncPushResponse {
  processedIds: string[];
  conflicts: SyncConflict[];
  nextRetryAt?: string | null;
}

export interface SyncPullResponse {
  cursor: string;
  products: Product[];
  stock: Array<{ productId: string; quantity: number; updatedAt: string }>;
}

export interface DashboardMetric {
  label: string;
  count: number;
  amount: number;
  accent: string;
}

export interface DashboardSnapshot {
  soldOrders: DashboardMetric[];
  pendingOrders: number;
  tables: Array<{ label: string; status: string; totalAmount: number }>;
  stockAlerts: Array<{ productName: string; quantity: number; minStock: number }>;
}

export interface XmlImportedProduct {
  name: string;
  unit?: string | null;
  gtin?: string | null;
  ncm?: string | null;
  cfop?: string | null;
  costPrice: number;
  salePrice: number;
  quantity: number;
}

export interface XmlImportPreviewItem extends XmlImportedProduct {
  productId?: string | null;
  sku?: string | null;
  productName?: string | null;
  matchType: "BARCODE" | "NAME" | "NEW";
}

export interface XmlImportPreview {
  accessKey: string;
  supplierName?: string;
  marginPercent: number;
  items: XmlImportPreviewItem[];
}

export const saleSteps: Array<{ id: SaleStep; label: string }> = [
  { id: "NEW_SALE", label: "Nova venda" },
  { id: "PAYMENT", label: "Forma de pagamento" },
  { id: "FINALIZE", label: "Finalizar venda" }
];

export const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  shortcut: string;
  accent: string;
}> = [
  { id: "CASH", label: "Dinheiro", shortcut: "F1", accent: "cash" },
  { id: "CHECK", label: "Cheque", shortcut: "F2", accent: "check" },
  { id: "CREDIT_CARD", label: "Cartão de Crédito", shortcut: "F3", accent: "credit" },
  { id: "DEBIT_CARD", label: "Cartão de Débito", shortcut: "F4", accent: "debit" },
  { id: "STORE_CREDIT", label: "Crédito Loja", shortcut: "F5", accent: "store-credit" },
  { id: "FOOD_VOUCHER", label: "Vale Alimentação", shortcut: "F6", accent: "food" },
  { id: "MEAL_VOUCHER", label: "Vale Refeição", shortcut: "F7", accent: "meal" },
  { id: "GIFT_VOUCHER", label: "Vale Presente", shortcut: "F8", accent: "gift" },
  { id: "FUEL_VOUCHER", label: "Vale Combustível", shortcut: "F9", accent: "fuel" },
  { id: "OTHER", label: "Outros", shortcut: "F10", accent: "other" },
  { id: "PIX", label: "PIX", shortcut: "P", accent: "pix" },
  { id: "CASHBACK", label: "Cashback", shortcut: "C", accent: "cashback" },
  { id: "MERCADO_PAGO", label: "Mercado Pago", shortcut: "-", accent: "marketplace" }
];

export const demoContext = {
  organizationId: "org_demo",
  storeId: "store_demo",
  operatorId: "cashier-001"
};

export const demoOperator: UserIdentity = {
  id: demoContext.operatorId,
  email: "operador@loja.com",
  name: "Operador Caixa 01",
  role: "CASHIER"
};

export const demoProducts: Array<{
  id: string;
  sku: string;
  barcode: string;
  name: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stockQuantity: number;
  minStock: number;
}> = [
  {
    id: "prod-001",
    sku: "7891000100103",
    barcode: "7891000100103",
    name: "Café Especial 500g",
    unit: "UN",
    costPrice: 18.4,
    salePrice: 28.9,
    stockQuantity: 26,
    minStock: 8
  },
  {
    id: "prod-002",
    sku: "7891000100104",
    barcode: "7891000100104",
    name: "Água Mineral 510ml",
    unit: "UN",
    costPrice: 1.4,
    salePrice: 3.5,
    stockQuantity: 64,
    minStock: 20
  },
  {
    id: "prod-003",
    sku: "7891000100105",
    barcode: "7891000100105",
    name: "Pão de Queijo Tradicional",
    unit: "UN",
    costPrice: 2.7,
    salePrice: 6.9,
    stockQuantity: 34,
    minStock: 10
  },
  {
    id: "prod-004",
    sku: "7891000100106",
    barcode: "7891000100106",
    name: "Refrigerante Cola 2L",
    unit: "UN",
    costPrice: 6.8,
    salePrice: 11.9,
    stockQuantity: 18,
    minStock: 6
  }
];
