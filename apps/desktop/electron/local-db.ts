import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { demoContext, demoOperator, demoProducts, type PaymentMethod, type Product, type SyncQueueItem, type UserIdentity } from "@pdv/types";
import { sqliteBootstrapStatements } from "../../../packages/database/src/local-sqlite";
import type { DesktopBootstrap, DesktopSettings } from "../src/contracts";

interface PersistedSalePayload {
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

const defaultDesktopSettings: DesktopSettings = {
  apiBaseUrl: "http://localhost:3333/v1",
  organizationId: demoContext.organizationId,
  storeId: demoContext.storeId,
  operatorId: demoOperator.id,
  operatorName: demoOperator.name,
  operatorEmail: demoOperator.email
};

const demoProductIds = new Set(demoProducts.map((product) => product.id));

export class LocalDatabase {
  private db: Database.Database;

  constructor(filePath: string) {
    this.db = new Database(filePath);
    this.db.pragma("journal_mode = WAL");
  }

  init() {
    this.db.exec(sqliteBootstrapStatements);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    this.ensureCatalogInitialized(this.getSettings());
  }

  bootstrap(): DesktopBootstrap {
    const settings = this.getSettings();

    return {
      operator: this.getOperatorFromSettings(settings),
      priceLabel: "Preço Padrão",
      syncPending: this.getPendingSyncCount(),
      cashSessionOpen: this.isCashSessionOpen(),
      settings,
      lastSyncError: this.getLatestSyncError()
    };
  }

  getSettings(): DesktopSettings {
    return {
      apiBaseUrl: this.readState("settings.apiBaseUrl") ?? defaultDesktopSettings.apiBaseUrl,
      organizationId: this.readState("settings.organizationId") ?? defaultDesktopSettings.organizationId,
      storeId: this.readState("settings.storeId") ?? defaultDesktopSettings.storeId,
      operatorId: this.readState("settings.operatorId") ?? defaultDesktopSettings.operatorId,
      operatorName: this.readState("settings.operatorName") ?? defaultDesktopSettings.operatorName,
      operatorEmail: this.readState("settings.operatorEmail") ?? defaultDesktopSettings.operatorEmail
    };
  }

  saveSettings(settings: DesktopSettings) {
    const normalized = this.normalizeSettings(settings);
    const currentSettings = this.getSettings();
    const contextChanged = this.getCatalogContextKey(currentSettings) !== this.getCatalogContextKey(normalized);
    const operatorChanged = currentSettings.operatorId !== normalized.operatorId;

    if ((contextChanged || operatorChanged) && this.isCashSessionOpen()) {
      throw new Error("Feche o caixa antes de alterar organizacao, loja ou operador.");
    }

    if (contextChanged && this.hasBlockingPendingOperations()) {
      throw new Error("Sincronize ou resolva as pendencias antes de trocar organizacao ou loja.");
    }

    this.writeState("settings.apiBaseUrl", normalized.apiBaseUrl);
    this.writeState("settings.organizationId", normalized.organizationId);
    this.writeState("settings.storeId", normalized.storeId);
    this.writeState("settings.operatorId", normalized.operatorId);
    this.writeState("settings.operatorName", normalized.operatorName);
    this.writeState("settings.operatorEmail", normalized.operatorEmail);

    if (contextChanged) {
      this.resetCatalogForContext(normalized);
    } else {
      this.writeState("catalog.context", this.getCatalogContextKey(normalized));
      this.ensureCatalogQueued(normalized);
    }

    return this.bootstrap();
  }

  searchProducts(query: string): Product[] {
    const sanitized = query.trim();

    if (!sanitized) {
      const statement = this.db.prepare(`
        SELECT
          id,
          sku,
          barcode,
          name,
          unit,
          cost_price as costPrice,
          sale_price as salePrice,
          stock_quantity as stockQuantity,
          min_stock as minStock,
          updated_at as updatedAt,
          version
        FROM local_products
        WHERE is_active = 1
        ORDER BY name ASC
        LIMIT 8
      `);

      const rows = statement.all() as Array<Record<string, unknown>>;
      return rows.map((row) => this.mapProduct(row));
    }

    const statement = this.db.prepare(`
      SELECT
        id,
        sku,
        barcode,
        name,
        unit,
        cost_price as costPrice,
        sale_price as salePrice,
        stock_quantity as stockQuantity,
        min_stock as minStock,
        updated_at as updatedAt,
        version
      FROM local_products
      WHERE is_active = 1
        AND (
          barcode = @exact
          OR sku = @exact
          OR name LIKE @contains
          OR barcode LIKE @contains
        )
      ORDER BY
        CASE WHEN barcode = @exact OR sku = @exact THEN 0 ELSE 1 END,
        name ASC
      LIMIT 8
    `);

    const rows = statement.all({ exact: sanitized, contains: `%${sanitized}%` }) as Array<Record<string, unknown>>;
    return rows.map((row) => this.mapProduct(row));
  }

  saveSale(payload: PersistedSalePayload) {
    if (!payload.items.length) {
      throw new Error("A venda precisa ter ao menos um item.");
    }

    if (!payload.payments.length) {
      throw new Error("Informe ao menos uma forma de pagamento.");
    }

    if (!this.isCashSessionOpen()) {
      throw new Error("Abra o caixa antes de concluir uma venda.");
    }

    const totalPayments = payload.payments.reduce((total, payment) => total + payment.amount, 0);
    if (totalPayments + 0.001 < payload.totalAmount) {
      throw new Error("O pagamento informado não cobre o total da venda.");
    }

    const saleId = randomUUID();
    const now = new Date().toISOString();
    const settings = this.getSettings();

    const validateStock = this.db.prepare(`
      SELECT id, name, stock_quantity as stockQuantity
      FROM local_products
      WHERE id = @productId
    `);

    for (const item of payload.items) {
      const product = validateStock.get({ productId: item.productId }) as
        | { id: string; name: string; stockQuantity: number }
        | undefined;

      if (!product) {
        throw new Error(`Produto ${item.productName} não encontrado no banco local.`);
      }

      if (Number(product.stockQuantity) < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${Number(product.stockQuantity)}.`);
      }
    }

    const persist = this.db.transaction(() => {
      this.db
        .prepare(`
          INSERT INTO local_sales (
            id, operator_id, subtotal_amount, discount_amount, total_amount, status, created_at, updated_at
          ) VALUES (
            @id, @operatorId, @subtotalAmount, @discountAmount, @totalAmount, 'COMPLETED', @createdAt, @updatedAt
          )
        `)
        .run({
          id: saleId,
          operatorId: payload.operatorId,
          subtotalAmount: payload.subtotalAmount,
          discountAmount: payload.discountAmount,
          totalAmount: payload.totalAmount,
          createdAt: now,
          updatedAt: now
        });

      const itemStatement = this.db.prepare(`
        INSERT INTO local_sale_items (
          id, sale_id, product_id, product_name, quantity, unit_price, discount_amount, total_amount
        ) VALUES (
          @id, @saleId, @productId, @productName, @quantity, @unitPrice, @discountAmount, @totalAmount
        )
      `);

      const paymentStatement = this.db.prepare(`
        INSERT INTO local_sale_payments (
          id, sale_id, method, amount, reference
        ) VALUES (
          @id, @saleId, @method, @amount, @reference
        )
      `);

      const stockStatement = this.db.prepare(`
        UPDATE local_products
        SET stock_quantity = stock_quantity - @quantity,
            version = version + 1,
            updated_at = @updatedAt
        WHERE id = @productId
      `);

      for (const item of payload.items) {
        itemStatement.run({
          id: randomUUID(),
          saleId,
          ...item
        });

        stockStatement.run({
          productId: item.productId,
          quantity: item.quantity,
          updatedAt: now
        });
      }

      for (const payment of payload.payments) {
        paymentStatement.run({
          id: randomUUID(),
          saleId,
          method: payment.method,
          amount: payment.amount,
          reference: payment.reference ?? null
        });
      }

      this.enqueue("sale", "CREATE_SALE", {
        saleId,
        organizationId: settings.organizationId,
        storeId: settings.storeId,
        operatorId: payload.operatorId,
        operatorName: settings.operatorName,
        operatorEmail: settings.operatorEmail,
        subtotalAmount: payload.subtotalAmount,
        discountAmount: payload.discountAmount,
        totalAmount: payload.totalAmount,
        items: payload.items,
        payments: payload.payments,
        createdAt: now
      });
    });

    persist();

    return {
      saleId,
      syncPending: this.getPendingSyncCount()
    };
  }

  toggleCashSession(operatorId: string) {
    const settings = this.getSettings();
    const open = this.db.prepare("SELECT * FROM cash_sessions WHERE status = 'OPEN' LIMIT 1").get() as
      | { id: string; opened_at: string }
      | undefined;

    if (open) {
      const closedAt = new Date().toISOString();

      this.db
        .prepare(`
          UPDATE cash_sessions
          SET status = 'CLOSED',
              closed_at = @closedAt,
              closing_amount = 0
          WHERE id = @id
        `)
        .run({
          id: open.id,
          closedAt
        });

      this.enqueue("cash_session", "CLOSE_CASH_SESSION", {
        cashSessionId: open.id,
        organizationId: settings.organizationId,
        storeId: settings.storeId,
        operatorId,
        operatorName: settings.operatorName,
        operatorEmail: settings.operatorEmail,
        closedAt,
        closingAmount: 0
      });

      return {
        status: "CLOSED" as const,
        syncPending: this.getPendingSyncCount()
      };
    }

    const id = randomUUID();
    const openedAt = new Date().toISOString();

    this.db
      .prepare(`
        INSERT INTO cash_sessions (
          id, opened_by_id, opened_at, opening_amount, status
        ) VALUES (
          @id, @openedById, @openedAt, 0, 'OPEN'
        )
      `)
      .run({
        id,
        openedById: operatorId,
        openedAt
      });

    this.enqueue("cash_session", "OPEN_CASH_SESSION", {
      cashSessionId: id,
      organizationId: settings.organizationId,
      storeId: settings.storeId,
      operatorId,
      operatorName: settings.operatorName,
      operatorEmail: settings.operatorEmail,
      openedAt,
      openingAmount: 0
    });

    return {
      status: "OPEN" as const,
      syncPending: this.getPendingSyncCount()
    };
  }

  getPendingSyncCount() {
    const row = this.db
      .prepare("SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('PENDING', 'FAILED')")
      .get() as { count: number };

    return row.count;
  }

  getPendingOperations(): SyncQueueItem[] {
    const rows = this.db
      .prepare(`
        SELECT *
        FROM sync_queue
        WHERE status IN ('PENDING', 'FAILED')
          AND scheduled_at <= @now
        ORDER BY created_at ASC
        LIMIT 50
      `)
      .all({ now: new Date().toISOString() }) as Array<Record<string, unknown>>;

    return rows.map((row) => ({
      id: String(row.id),
      entity: row.entity as SyncQueueItem["entity"],
      operation: row.operation as SyncQueueItem["operation"],
      payload: JSON.parse(String(row.payload)),
      status: row.status as SyncQueueItem["status"],
      attempts: Number(row.attempts),
      scheduledAt: String(row.scheduled_at),
      lastError: row.last_error ? String(row.last_error) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    }));
  }

  markSyncProcessed(ids: string[]) {
    const updateQueue = this.db.prepare(`
      UPDATE sync_queue
      SET status = 'SYNCED',
          last_error = NULL,
          updated_at = @updatedAt
      WHERE id = @id
    `);

    const updateSale = this.db.prepare(`
      UPDATE local_sales
      SET synced_at = @syncedAt,
          updated_at = @updatedAt
      WHERE id = @saleId
    `);

    const transaction = this.db.transaction((queueIds: string[]) => {
      const syncedAt = new Date().toISOString();

      for (const id of queueIds) {
        const row = this.db.prepare("SELECT operation, payload FROM sync_queue WHERE id = ?").get(id) as
          | { operation: string; payload: string }
          | undefined;

        if (row?.operation === "CREATE_SALE") {
          const payload = JSON.parse(row.payload) as { saleId?: string };
          if (payload.saleId) {
            updateSale.run({
              saleId: payload.saleId,
              syncedAt,
              updatedAt: syncedAt
            });
          }
        }

        updateQueue.run({
          id,
          updatedAt: syncedAt
        });
      }
    });

    transaction(ids);

    if (this.getPendingSyncCount() === 0) {
      this.clearSyncError();
    }
  }

  markSyncFailed(id: string, attempts: number, reason: string, delayMs: number) {
    this.db
      .prepare(`
        UPDATE sync_queue
        SET status = 'FAILED',
            attempts = @attempts,
            last_error = @lastError,
            scheduled_at = @scheduledAt,
            updated_at = @updatedAt
        WHERE id = @id
      `)
      .run({
        id,
        attempts,
        lastError: reason,
        scheduledAt: new Date(Date.now() + delayMs).toISOString(),
        updatedAt: new Date().toISOString()
      });

    this.setSyncError(reason);
  }

  markSyncConflict(id: string, reason: string) {
    this.db
      .prepare(`
        UPDATE sync_queue
        SET status = 'CONFLICT',
            last_error = @lastError,
            updated_at = @updatedAt
        WHERE id = @id
      `)
      .run({
        id,
        lastError: reason,
        updatedAt: new Date().toISOString()
      });

    this.setSyncError(reason);
  }

  getCursor() {
    return this.readState("last_cursor");
  }

  setCursor(cursor: string) {
    this.writeState("last_cursor", cursor);
    this.writeState("last_sync_at", new Date().toISOString());
    this.clearSyncError();
  }

  setSyncError(message: string) {
    this.writeState("last_sync_error", message);
  }

  clearSyncError() {
    this.deleteState("last_sync_error");
  }

  getLatestSyncError() {
    return this.readState("last_sync_error");
  }

  applyRemoteProducts(products: Product[]) {
    const statement = this.db.prepare(`
      INSERT INTO local_products (
        id, sku, barcode, name, unit, cost_price, sale_price, stock_quantity, min_stock, ncm, cfop, is_active, version, updated_at
      ) VALUES (
        @id, @sku, @barcode, @name, @unit, @costPrice, @salePrice, @stockQuantity, @minStock, @ncm, @cfop, @isActive, @version, @updatedAt
      )
      ON CONFLICT(id) DO UPDATE SET
        sku = excluded.sku,
        barcode = excluded.barcode,
        name = excluded.name,
        unit = excluded.unit,
        cost_price = excluded.cost_price,
        sale_price = excluded.sale_price,
        stock_quantity = excluded.stock_quantity,
        min_stock = excluded.min_stock,
        ncm = excluded.ncm,
        cfop = excluded.cfop,
        is_active = excluded.is_active,
        version = excluded.version,
        updated_at = excluded.updated_at
    `);

    const transaction = this.db.transaction((items: Product[]) => {
      for (const product of items) {
        statement.run({
          ...product,
          barcode: product.barcode ?? null,
          ncm: product.ncm ?? null,
          cfop: product.cfop ?? null,
          isActive: product.isActive ? 1 : 0
        });
      }
    });

    transaction(products);
  }

  applyRemoteStock(stock: Array<{ productId: string; quantity: number }>) {
    const statement = this.db.prepare(`
      UPDATE local_products
      SET stock_quantity = @quantity,
          updated_at = @updatedAt
      WHERE id = @productId
    `);

    const transaction = this.db.transaction((items: Array<{ productId: string; quantity: number }>) => {
      const updatedAt = new Date().toISOString();

      for (const item of items) {
        statement.run({
          productId: item.productId,
          quantity: item.quantity,
          updatedAt
        });
      }
    });

    transaction(stock);
  }

  private ensureCatalogInitialized(settings: DesktopSettings) {
    const catalogContext = this.getCatalogContext();
    const nextContext = this.getCatalogContextKey(settings);

    if (!catalogContext) {
      if (!this.isDemoContext(settings) && this.hasOnlyDemoCatalog()) {
        this.clearLocalCatalog();
      } else if (this.isDemoContext(settings) && this.getLocalProductCount() === 0) {
        this.seedDemoCatalog();
      }

      this.writeState("catalog.context", nextContext);
      this.ensureCatalogQueued(settings);
      return;
    }

    if (catalogContext !== nextContext) {
      if (!this.hasBlockingPendingOperations() && !this.isCashSessionOpen()) {
        this.resetCatalogForContext(settings);
      } else {
        this.setSyncError("Existe um contexto antigo no catalogo local. Sincronize e feche o caixa antes de trocar o contexto.");
      }
      return;
    }

    if (this.isDemoContext(settings) && this.getLocalProductCount() === 0) {
      this.seedDemoCatalog();
    }

    this.ensureCatalogQueued(settings);
  }

  private seedDemoCatalog() {
    if (this.getLocalProductCount() > 0) {
      return;
    }

    const statement = this.db.prepare(`
      INSERT INTO local_products (
        id, sku, barcode, name, unit, cost_price, sale_price, stock_quantity, min_stock, updated_at
      ) VALUES (
        @id, @sku, @barcode, @name, @unit, @costPrice, @salePrice, @stockQuantity, @minStock, @updatedAt
      )
    `);

    const now = new Date().toISOString();
    const transaction = this.db.transaction(() => {
      for (const product of demoProducts) {
        statement.run({
          ...product,
          updatedAt: now
        });
      }
    });

    transaction();
  }

  private resetCatalogForContext(settings: DesktopSettings) {
    this.clearLocalCatalog();
    this.deleteState("last_cursor");
    this.deleteState("last_sync_at");
    this.clearSyncError();

    if (this.isDemoContext(settings)) {
      this.seedDemoCatalog();
    }

    this.writeState("catalog.context", this.getCatalogContextKey(settings));
    this.ensureCatalogQueued(settings, true);
  }

  private clearLocalCatalog() {
    this.db.prepare("DELETE FROM local_products").run();
    this.db.prepare("DELETE FROM sync_queue WHERE entity IN ('product', 'stock')").run();
  }

  private getLocalProductCount() {
    const row = this.db.prepare("SELECT COUNT(*) as count FROM local_products").get() as { count: number };
    return row.count;
  }

  private getCatalogContext() {
    return this.readState("catalog.context");
  }

  private getCatalogContextKey(settings: DesktopSettings) {
    return `${settings.organizationId}:${settings.storeId}`;
  }

  private hasOnlyDemoCatalog() {
    const rows = this.db.prepare("SELECT id FROM local_products").all() as Array<{ id: string }>;
    return rows.length > 0 && rows.every((row) => demoProductIds.has(row.id));
  }

  private isDemoContext(settings: DesktopSettings) {
    return settings.organizationId === demoContext.organizationId && settings.storeId === demoContext.storeId;
  }

  private isCashSessionOpen() {
    const row = this.db.prepare("SELECT COUNT(*) as count FROM cash_sessions WHERE status = 'OPEN'").get() as { count: number };
    return row.count > 0;
  }

  private hasBlockingPendingOperations() {
    const row = this.db
      .prepare(`
        SELECT COUNT(*) as count
        FROM sync_queue
        WHERE entity IN ('sale', 'cash_session')
          AND status IN ('PENDING', 'FAILED', 'CONFLICT')
      `)
      .get() as { count: number };

    return row.count > 0;
  }

  private enqueue(entity: string, operation: string, payload: unknown) {
    const now = new Date().toISOString();

    this.db
      .prepare(`
        INSERT INTO sync_queue (
          id, entity, operation, payload, status, attempts, scheduled_at, created_at, updated_at
        ) VALUES (
          @id, @entity, @operation, @payload, 'PENDING', 0, @scheduledAt, @createdAt, @updatedAt
        )
      `)
      .run({
        id: randomUUID(),
        entity,
        operation,
        payload: JSON.stringify(payload),
        scheduledAt: now,
        createdAt: now,
        updatedAt: now
      });
  }

  private ensureCatalogQueued(settings: DesktopSettings, replaceExisting = false) {
    const isDemoContext =
      settings.organizationId === demoContext.organizationId && settings.storeId === demoContext.storeId;

    const hasQueuedCatalog = this.db
      .prepare(`
        SELECT COUNT(*) as count
        FROM sync_queue
        WHERE entity IN ('product', 'stock')
          AND status IN ('PENDING', 'FAILED', 'CONFLICT')
      `)
      .get() as { count: number };

    if (!replaceExisting && hasQueuedCatalog.count > 0) {
      return;
    }

    if (replaceExisting) {
      this.db
        .prepare(`
          DELETE FROM sync_queue
          WHERE entity IN ('product', 'stock')
            AND status IN ('PENDING', 'FAILED', 'CONFLICT')
        `)
        .run();
    }

    if (!isDemoContext) {
      return;
    }

    const rows = this.db
      .prepare(`
        SELECT
          id,
          sku,
          barcode,
          name,
          unit,
          cost_price as costPrice,
          sale_price as salePrice,
          stock_quantity as stockQuantity,
          min_stock as minStock,
          ncm,
          cfop,
          is_active as isActive,
          version,
          updated_at as updatedAt
        FROM local_products
        WHERE is_active = 1
        ORDER BY name ASC
      `)
      .all() as Array<Record<string, unknown>>;

    const transaction = this.db.transaction((products: Array<Record<string, unknown>>) => {
      for (const product of products) {
        this.enqueue("product", "UPSERT_PRODUCT", {
          organizationId: settings.organizationId,
          id: String(product.id),
          sku: String(product.sku),
          barcode: product.barcode ? String(product.barcode) : null,
          name: String(product.name),
          description: null,
          unit: String(product.unit),
          costPrice: Number(product.costPrice),
          salePrice: Number(product.salePrice),
          minStock: Number(product.minStock),
          ncm: product.ncm ? String(product.ncm) : null,
          cfop: product.cfop ? String(product.cfop) : null,
          version: Number(product.version)
        });

        this.enqueue("stock", "UPSERT_STOCK", {
          productId: String(product.id),
          quantity: Number(product.stockQuantity)
        });
      }
    });

    transaction(rows);
  }

  private mapProduct(row: Record<string, unknown>): Product {
    return {
      id: String(row.id),
      sku: String(row.sku),
      barcode: row.barcode ? String(row.barcode) : null,
      name: String(row.name),
      description: null,
      unit: String(row.unit),
      costPrice: Number(row.costPrice),
      salePrice: Number(row.salePrice),
      stockQuantity: Number(row.stockQuantity),
      minStock: Number(row.minStock),
      ncm: null,
      cfop: null,
      isActive: true,
      updatedAt: String(row.updatedAt),
      version: Number(row.version)
    };
  }

  private getOperatorFromSettings(settings: DesktopSettings): UserIdentity {
    return {
      id: settings.operatorId,
      email: settings.operatorEmail,
      name: settings.operatorName,
      role: "CASHIER"
    };
  }

  private normalizeSettings(settings: DesktopSettings): DesktopSettings {
    const apiBaseUrl = settings.apiBaseUrl.trim().replace(/\/+$/, "");
    const organizationId = settings.organizationId.trim();
    const storeId = settings.storeId.trim();
    const operatorId = settings.operatorId.trim();
    const operatorName = settings.operatorName.trim();
    const operatorEmail = settings.operatorEmail.trim();

    if (!apiBaseUrl || !organizationId || !storeId || !operatorId || !operatorName || !operatorEmail) {
      throw new Error("Preencha todos os campos de configuração do PDV.");
    }

    return {
      apiBaseUrl,
      organizationId,
      storeId,
      operatorId,
      operatorName,
      operatorEmail
    };
  }

  private readState(key: string) {
    const row = this.db.prepare("SELECT value FROM sync_state WHERE key = @key").get({ key }) as
      | { value: string }
      | undefined;

    return row?.value ?? null;
  }

  private writeState(key: string, value: string) {
    this.db
      .prepare(`
        INSERT INTO sync_state (key, value, updated_at)
        VALUES (@key, @value, @updatedAt)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = excluded.updated_at
      `)
      .run({
        key,
        value,
        updatedAt: new Date().toISOString()
      });
  }

  private deleteState(key: string) {
    this.db.prepare("DELETE FROM sync_state WHERE key = @key").run({ key });
  }
}
