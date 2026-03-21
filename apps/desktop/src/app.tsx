import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { PaymentMethod, Product, SaleStep, UserIdentity } from "@pdv/types";
import { paymentMethods } from "@pdv/types";
import { Button, Card, ShortcutHint, StatusDot } from "@pdv/ui";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  LogOut,
  Package2,
  Power,
  RefreshCcw,
  Save,
  ScanBarcode,
  Settings,
  ShoppingCart,
  UserRound,
  Wallet,
  X
} from "lucide-react";
import type { DesktopSettings } from "./contracts";

interface CartItem {
  lineId: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  productName: string;
  unit: string;
  ncm?: string | null;
  cfop?: string | null;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalAmount: number;
}

interface ChosenPayment {
  method: PaymentMethod;
  label: string;
  amount: number;
}

const paymentShortcutMap = new Map(paymentMethods.map((method) => [method.shortcut.toUpperCase(), method.id]));

const paymentClassMap: Record<PaymentMethod, string> = {
  CASH: "cash",
  CHECK: "check",
  CREDIT_CARD: "credit",
  DEBIT_CARD: "debit",
  STORE_CREDIT: "store-credit",
  FOOD_VOUCHER: "food",
  MEAL_VOUCHER: "meal",
  GIFT_VOUCHER: "gift",
  FUEL_VOUCHER: "fuel",
  OTHER: "other",
  PIX: "pix",
  CASHBACK: "cashback",
  MERCADO_PAGO: "marketplace"
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatAmount(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatQuantity(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });
}

function formatReceiptCode(item: CartItem) {
  return item.barcode || item.sku || item.productId.slice(-6).toUpperCase();
}

function round(value: number) {
  return Number(value.toFixed(2));
}

export function App() {
  const [step, setStep] = useState<SaleStep>("NEW_SALE");
  const [query, setQuery] = useState("");
  const [operator, setOperator] = useState<UserIdentity>({
    id: "cashier-001",
    email: "operador@loja.com",
    name: "Operador",
    role: "CASHIER"
  });
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Product[]>([]);
  const [payments, setPayments] = useState<ChosenPayment[]>([]);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : false);
  const [syncPending, setSyncPending] = useState(0);
  const [cashSessionOpen, setCashSessionOpen] = useState(false);
  const [saleStartedAt, setSaleStartedAt] = useState(() => new Date());
  const [statusMessage, setStatusMessage] = useState("Caixa pronto para iniciar uma nova venda.");
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [settings, setSettings] = useState<DesktopSettings>({
    apiBaseUrl: "http://localhost:3333/v1",
    terminalId: "",
    sessionToken: "",
    organizationId: "org_demo",
    storeId: "store_demo",
    operatorId: "cashier-001",
    operatorName: "Operador Caixa 01",
    operatorEmail: "operador@loja.com"
  });
  const [settingsDraft, setSettingsDraft] = useState<DesktopSettings>(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement | null>(null);
  const discountInputRef = useRef<HTMLInputElement | null>(null);
  const matchCarouselRef = useRef<HTMLDivElement | null>(null);

  const subtotalAmount = useMemo(
    () => round(items.reduce((total, item) => total + item.quantity * item.unitPrice - item.discountAmount, 0)),
    [items]
  );
  const selectedItem = useMemo(() => items.find((item) => item.productId === selectedItemId) ?? null, [items, selectedItemId]);
  const totalAmount = useMemo(() => round(Math.max(subtotalAmount - discountAmount, 0)), [subtotalAmount, discountAmount]);
  const paidAmount = useMemo(() => round(payments.reduce((total, payment) => total + payment.amount, 0)), [payments]);
  const remainingAmount = useMemo(() => round(Math.max(totalAmount - paidAmount, 0)), [paidAmount, totalAmount]);
  const selectedQuantity = selectedItem?.quantity ?? 0;
  const selectedUnitPrice = selectedItem?.unitPrice ?? 0;
  const selectedLineTotal = selectedItem?.totalAmount ?? 0;
  useEffect(() => {
    void loadBootstrap();
  }, []);

  useEffect(() => {
    if (step === "NEW_SALE") {
      barcodeInputRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void window.pdv
        .searchProducts(query)
        .then(setMatches)
        .catch((error) => {
          setMatches([]);
          reportError("Falha ao consultar produtos", error);
        });
    }, query.trim() ? 140 : 0);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!online) {
      return;
    }

    void runSync();
    const timer = window.setInterval(() => {
      void runSync();
    }, 20000);

    return () => window.clearInterval(timer);
  }, [online]);

  useEffect(() => {
    if (!items.length) {
      if (selectedItemId !== null) {
        setSelectedItemId(null);
      }
      return;
    }

    const hasSelectedItem = selectedItemId ? items.some((item) => item.productId === selectedItemId) : false;
    if (!hasSelectedItem) {
      setSelectedItemId(items[items.length - 1]?.productId ?? null);
    }
  }, [items, selectedItemId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (settingsOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setSettingsOpen(false);
        }

        return;
      }

      if (step === "NEW_SALE") {
        if (event.key === "F2") {
          event.preventDefault();
          focusProductSearch();
        }

        if (event.key === "F3") {
          event.preventDefault();
          void addFirstMatch();
        }

        if (event.key === "F4") {
          event.preventDefault();
          adjustSelectedQuantity(1);
        }

        if (event.key === "F6") {
          event.preventDefault();
          if (selectedItemId) {
            removeItem(selectedItemId);
          } else {
            setStatusMessage("Selecione um item da venda para remover.");
          }
        }

        if (event.key === "F8") {
          event.preventDefault();
          goToPayment();
        }

        if (event.key === "F10") {
          event.preventDefault();
          discountInputRef.current?.focus();
          setStatusMessage("Campo de desconto selecionado.");
        }

        if (event.key === "F12") {
          event.preventDefault();
          void toggleCashSession();
        }
      }

      if (step === "PAYMENT") {
        if (event.key === "F11") {
          event.preventDefault();
          setStep("NEW_SALE");
          setStatusMessage("Retorno para a tela de venda.");
        }

        if (event.key === "F12") {
          event.preventDefault();
          goToFinalize();
        }

        const mapped = paymentShortcutMap.get(event.key.toUpperCase());
        if (mapped) {
          event.preventDefault();
          addPayment(mapped);
        }
      }

      if (step === "FINALIZE") {
        if (event.key === "F11") {
          event.preventDefault();
          setStep("PAYMENT");
          setStatusMessage("Retorno para a tela de pagamento.");
        }

        if (event.key === "F12") {
          event.preventDefault();
          void finalizeSale();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, paidAmount, remainingAmount, selectedItemId, settingsOpen, step]);

  async function loadBootstrap() {
    try {
      const data = await window.pdv.bootstrap();
      setOperator(data.operator);
      setSyncPending(data.syncPending);
      setCashSessionOpen(data.cashSessionOpen);
      setLastSyncError(data.lastSyncError);
      setSettings(data.settings);
      setSettingsDraft(data.settings);
    } catch (error) {
      reportError("Falha ao iniciar o PDV", error);
    }
  }

  async function runSync() {
    if (syncBusy) {
      return;
    }

    setSyncBusy(true);

    try {
      const result = await window.pdv.syncNow();
      const data = await window.pdv.bootstrap();
      setSyncPending(result.syncPending);
      setLastSyncError(data.lastSyncError);
      setSettings(data.settings);
      if (result.processed > 0) {
        setStatusMessage(`${result.processed} operação(ões) sincronizadas com a nuvem.`);
      }
    } catch (error) {
      reportError("Falha ao sincronizar", error);
    } finally {
      setSyncBusy(false);
    }
  }

  function reportError(context: string, error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    console.error(context, error);
    setStatusMessage(`${context}: ${message}`);
  }

  function scrollMatchCarousel(direction: "left" | "right") {
    matchCarouselRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth"
    });
  }

  function focusProductSearch() {
    setStep("NEW_SALE");
    window.requestAnimationFrame(() => {
      barcodeInputRef.current?.focus();
    });
    setStatusMessage("Busca selecionada. Digite um nome, SKU ou código de barras.");
  }

  function resetSale(message = "Venda atual cancelada. Caixa pronto para novo atendimento.") {
    setItems([]);
    setPayments([]);
    setDiscountAmount(0);
    setSelectedItemId(null);
    setSaleStartedAt(new Date());
    setStep("NEW_SALE");
    setQuery("");
    setStatusMessage(message);
  }

  function openSettings() {
    setSettingsDraft(settings);
    setSettingsOpen(true);
  }

  function updateSettingsDraft(field: keyof DesktopSettings, value: string) {
    setSettingsDraft((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function saveSettings() {
    setSavingSettings(true);

    try {
      const data = await window.pdv.saveSettings(settingsDraft);
      setSettings(data.settings);
      setSettingsDraft(data.settings);
      setOperator(data.operator);
      setLastSyncError(data.lastSyncError);
      setSyncPending(data.syncPending);
      setCashSessionOpen(data.cashSessionOpen);
      setSettingsOpen(false);
      setStatusMessage("Configuração salva. Executando sincronização.");
      if (online) {
        await runSync();
      }
    } catch (error) {
      reportError("Falha ao salvar configuração", error);
    } finally {
      setSavingSettings(false);
    }
  }

  function goToPayment() {
    if (!cashSessionOpen) {
      setStatusMessage("Abra o caixa antes de iniciar o pagamento.");
      return;
    }

    if (items.length === 0) {
      setStatusMessage("Adicione ao menos um produto antes de seguir para pagamento.");
      focusProductSearch();
      return;
    }

    setStep("PAYMENT");
    setStatusMessage("Selecione a forma de pagamento para concluir a venda.");
  }

  function goToFinalize() {
    if (!cashSessionOpen) {
      setStatusMessage("Abra o caixa antes de concluir uma venda.");
      return;
    }

    if (paidAmount <= 0) {
      setStatusMessage("Informe um pagamento antes de prosseguir para a finalização.");
      return;
    }

    if (remainingAmount > 0) {
      setStatusMessage("O valor pago ainda não cobre o total da venda.");
      return;
    }

    setStep("FINALIZE");
    setStatusMessage("Revise os dados e confirme a venda.");
  }

  function upsertItem(product: Product) {
    if (items.length === 0) {
      setSaleStartedAt(new Date());
    }

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalAmount: round((item.quantity + 1) * item.unitPrice - item.discountAmount)
              }
            : item
        );
      }

      return [
        ...current,
        {
          lineId: crypto.randomUUID(),
          productId: product.id,
          sku: product.sku,
          barcode: product.barcode,
          productName: product.name,
          unit: product.unit,
          ncm: product.ncm,
          cfop: product.cfop,
          quantity: 1,
          unitPrice: product.salePrice,
          discountAmount: 0,
          totalAmount: product.salePrice
        }
      ];
    });

    setSelectedItemId(product.id);
    setQuery("");
    setStatusMessage(`${product.name} adicionado à venda.`);
  }

  async function addFirstMatch() {
    try {
      const results = await window.pdv.searchProducts(query);
      if (!results.length) {
        setStatusMessage("Nenhum produto encontrado. Digite um nome, SKU ou código de barras válido.");
        return;
      }

      upsertItem(results[0]);
    } catch (error) {
      reportError("Falha ao adicionar produto", error);
    }
  }

  function adjustSelectedQuantity(delta: number) {
    if (!selectedItemId) {
      setStatusMessage("Selecione um item da venda para alterar a quantidade.");
      return;
    }

    const selectedItem = items.find((item) => item.productId === selectedItemId);
    if (selectedItem && selectedItem.quantity + delta <= 0) {
      setSelectedItemId(null);
    }

    setItems((current) =>
      current
        .map((item) => {
          if (item.productId !== selectedItemId) {
            return item;
          }

          const quantity = Math.max(item.quantity + delta, 0);
          return {
            ...item,
            quantity,
            totalAmount: round(quantity * item.unitPrice - item.discountAmount)
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function updateQuantity(productId: string, quantity: number) {
    const safeQuantity = Number.isFinite(quantity) ? Math.max(Math.trunc(quantity), 0) : 1;

    if (safeQuantity === 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: safeQuantity,
              totalAmount: round(safeQuantity * item.unitPrice - item.discountAmount)
            }
          : item
      )
    );
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.productId !== productId));
    setSelectedItemId((current) => (current === productId ? null : current));
    setStatusMessage("Item removido da venda.");
  }

  function addPayment(method: PaymentMethod) {
    const option = paymentMethods.find((item) => item.id === method);
    if (!cashSessionOpen) {
      setStatusMessage("Abra o caixa antes de informar pagamentos.");
      return;
    }

    if (!option || totalAmount <= 0) {
      setStatusMessage("Adicione produtos à venda antes de informar o pagamento.");
      return;
    }

    setPayments((current) => {
      const remainder = round(totalAmount - current.reduce((sum, item) => sum + item.amount, 0));
      const amountToAdd = remainder > 0 ? remainder : totalAmount;
      const existing = current.find((item) => item.method === method);

      if (existing) {
        return current.map((item) =>
          item.method === method
            ? {
                ...item,
                amount: round(item.amount + amountToAdd)
              }
            : item
        );
      }

      return [...current, { method, label: option.label, amount: amountToAdd }];
    });

    setStatusMessage(`${option.label} adicionado ao pagamento.`);
  }

  function updatePayment(method: PaymentMethod, amount: number) {
    const safeAmount = Number.isFinite(amount) ? Math.max(amount, 0) : 0;

    setPayments((current) =>
      current.map((item) =>
        item.method === method
          ? {
              ...item,
              amount: safeAmount
            }
          : item
      )
    );
  }

  function removePayment(method: PaymentMethod) {
    setPayments((current) => current.filter((item) => item.method !== method));
    setStatusMessage("Forma de pagamento removida.");
  }

  async function toggleCashSession() {
    try {
      const result = await window.pdv.toggleCashSession(operator.id);
      setCashSessionOpen(result.status === "OPEN");
      setSyncPending(result.syncPending);
      setStatusMessage(result.status === "OPEN" ? "Caixa aberto para operações." : "Caixa fechado localmente e enviado para sync.");
    } catch (error) {
      reportError("Falha ao alterar o estado do caixa", error);
    }
  }

  async function finalizeSale() {
    if (!items.length) {
      setStatusMessage("Adicione ao menos um item antes de finalizar.");
      setStep("NEW_SALE");
      return;
    }

    if (remainingAmount > 0) {
      setStatusMessage("O pagamento ainda não cobre o total da venda.");
      setStep("PAYMENT");
      return;
    }

    try {
      const result = await window.pdv.saveSale({
        operatorId: operator.id,
        subtotalAmount,
        discountAmount,
        totalAmount,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          totalAmount: item.totalAmount
        })),
        payments: payments.map((payment) => ({
          method: payment.method,
          amount: payment.amount
        }))
      });

      resetSale(`Venda ${result.saleId.slice(0, 8)} finalizada e enfileirada para sincronização.`);
      setSyncPending(result.syncPending);

      if (online) {
        await runSync();
      }
    } catch (error) {
      reportError("Falha ao finalizar venda", error);
    }
  }

  function handleBarcodeEnter(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void addFirstMatch();
    }
  }

  return (
    <div className="pdv-app">
      <header className="pdv-header">
        <div className="brand-block">
          <div className="brand-logo">SIGE Lite</div>
          <span className="brand-tag">desktop operacional</span>
        </div>
        <div className="header-actions">
          <span className="header-user">
            <UserRound size={16} />
            {operator.email}
          </span>
          <span className={`status-chip ${cashSessionOpen ? "success" : "warning"}`}>
            Caixa {cashSessionOpen ? "aberto" : "fechado"}
          </span>
          <button className="icon-button" type="button" onClick={openSettings}>
            <Settings size={18} />
          </button>
          <button className="icon-button" type="button" onClick={() => resetSale()}>
            <LogOut size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => {
              setStatusMessage("Encerrando o PDV.");
              window.close();
            }}
          >
            <Power size={18} />
          </button>
        </div>
      </header>

      <main className="pdv-main">
        {step === "NEW_SALE" ? (
          <section className="pdv-section new-sale-layout">
            <div className="scan-row">
              <div className="scan-field">
                <ScanBarcode size={20} />
                <input
                  ref={barcodeInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleBarcodeEnter}
                  placeholder="Informe o código, SKU ou leia o código de barras para adicionar um produto ou serviço..."
                />
              </div>
              <Button variant="primary" shortcut="F3" onClick={() => void addFirstMatch()} style={{ maxWidth: 320 }}>
                + Adicionar Produto / Serviço
              </Button>
            </div>

            {matches.length > 0 ? (
              <div className="match-strip">
                <div className="match-strip-header">
                  <div>
                    <strong>Sugestões rapidas</strong>
                    <span>Deslize na horizontal ou use as setas para lançar itens mais rápido.</span>
                  </div>
                  <div className="match-nav">
                    <button type="button" className="match-nav-button" onClick={() => scrollMatchCarousel("left")} aria-label="Rolar produtos para a esquerda">
                      <ArrowLeft size={16} />
                    </button>
                    <button type="button" className="match-nav-button" onClick={() => scrollMatchCarousel("right")} aria-label="Rolar produtos para a direita">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div ref={matchCarouselRef} className="match-carousel">
                  {matches.slice(0, 12).map((match) => (
                    <button key={match.id} type="button" className="match-card" onClick={() => upsertItem(match)}>
                      <span className="match-thumb" aria-hidden="true">
                        <Package2 size={20} />
                      </span>
                      <span className="match-card-name" title={match.name}>
                        {match.name}
                      </span>
                      <span className="match-card-code">{match.barcode || match.sku}</span>
                      <strong className="match-card-price">{formatCurrency(match.salePrice)}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <Card className="sale-table-card">
              <div className="sale-table-header">
                <span>Cod. Barras</span>
                <span>Descrição</span>
                <span>Qtd.</span>
                <span>Vl. Unit.</span>
                <span>Vl. Total</span>
              </div>
              <div className="sale-table-body">
                {items.map((item) => (
                  <button
                    key={item.productId}
                    type="button"
                    className={`sale-row ${selectedItemId === item.productId ? "selected" : ""}`}
                    onClick={() => setSelectedItemId(item.productId)}
                  >
                    <span className="receipt-code-cell">{formatReceiptCode(item)}</span>
                    <span className="row-name">{item.productName}</span>
                    <span className="receipt-data-cell">{item.quantity}</span>
                    <span className="receipt-data-cell">{formatCurrency(item.unitPrice)}</span>
                    <span className="row-total receipt-total">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="sale-table-total-strip">
                <div className="sale-table-total-label">Total compra R$</div>
                <strong className="sale-table-total-value">{formatAmount(totalAmount)}</strong>
              </div>
            </Card>

            <div className="summary-grid">
              <div className="summary-box metric">
                <span className="summary-kicker">Quantidade</span>
                <strong className="summary-metric-value">{formatQuantity(selectedQuantity)}</strong>
              </div>
              <div className="summary-box center operator compact">
                <strong className="summary-operator-mark">x</strong>
              </div>
              <div className="summary-box metric">
                <span className="summary-kicker">Valor unitario</span>
                <strong className="summary-metric-money">{formatCurrency(selectedUnitPrice)}</strong>
              </div>
              <div className="summary-box total">
                <span className="summary-kicker">Valor total</span>
                <strong className="summary-grand-total">{formatCurrency(selectedLineTotal)}</strong>
              </div>
            </div>

            <div className="message-row">
              <div className="inline-status-message">{statusMessage}</div>
              <label className="discount-strip">
                <span>Desconto (F10)</span>
                <input
                  ref={discountInputRef}
                  className="discount-input discount-strip-input"
                  value={discountAmount.toFixed(2)}
                  onChange={(event) => {
                    const nextDiscount = Number(event.target.value.replace(",", "."));
                    setDiscountAmount(Number.isFinite(nextDiscount) ? Math.max(nextDiscount, 0) : 0);
                  }}
                />
              </label>
            </div>

            <div className="bottom-actions">
              <Button variant="secondary" shortcut="F12" onClick={() => void toggleCashSession()} style={{ maxWidth: 330 }}>
                Operações de Caixa {cashSessionOpen ? "· Aberto" : "· Fechado"}
              </Button>
              <Button variant="success" shortcut="F8" onClick={goToPayment} style={{ maxWidth: 330 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <ShoppingCart size={20} />
                  Finalizar Venda
                </span>
              </Button>
            </div>
          </section>
        ) : null}

        {step === "PAYMENT" ? (
          <section className="pdv-section">
            <div className="payment-grid">
              {paymentMethods.map((method) => (
                <button key={method.id} type="button" className={`payment-button ${paymentClassMap[method.id]}`} onClick={() => addPayment(method.id)}>
                  <CreditCard size={26} />
                  <strong>{method.label}</strong>
                  <ShortcutHint label={method.shortcut} />
                </button>
              ))}
            </div>

            <div className="payment-summary-layout">
              <Card className="payment-summary">
                <h3>Pagamentos Selecionados</h3>
                <div className="payment-list">
                  {payments.length === 0 ? (
                    <div className="empty-state slim">Selecione uma forma de pagamento com as teclas F1-F10, P ou C.</div>
                  ) : (
                    payments.map((payment) => (
                      <div key={payment.method} className="payment-row">
                        <strong>{payment.label}</strong>
                        <input
                          value={payment.amount.toFixed(2)}
                          onChange={(event) => updatePayment(payment.method, Number(event.target.value.replace(",", ".")))}
                        />
                        <button type="button" onClick={() => removePayment(payment.method)}>
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="payment-summary totals">
                <h3>Resumo Financeiro</h3>
                <div className="payment-totals">
                  <div>
                    <span>Total da venda</span>
                    <strong>{formatCurrency(totalAmount)}</strong>
                  </div>
                  <div>
                    <span>Total pago</span>
                    <strong>{formatCurrency(paidAmount)}</strong>
                  </div>
                  <div>
                    <span>Restante</span>
                    <strong className={remainingAmount > 0 ? "warning" : "success"}>{formatCurrency(remainingAmount)}</strong>
                  </div>
                </div>
              </Card>
            </div>

            <div className="payment-actions">
              <Button
                variant="ghost"
                shortcut="F11"
                onClick={() => {
                  setStep("NEW_SALE");
                  setStatusMessage("Retorno para a tela de venda.");
                }}
                style={{ maxWidth: 280 }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <ArrowLeft size={18} />
                  Voltar
                </span>
              </Button>
              <Button variant="success" shortcut="F12" onClick={goToFinalize} style={{ maxWidth: 280 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  Prosseguir
                  <ArrowRight size={18} />
                </span>
              </Button>
            </div>
          </section>
        ) : null}

        {step === "FINALIZE" ? (
          <section className="pdv-section finalize-layout">
            <Card className="final-card">
              <h3>Finalizar Venda</h3>
              <div className="final-grid">
                <div>
                  <span className="muted-line">Itens</span>
                  <strong>{items.length}</strong>
                </div>
                <div>
                  <span className="muted-line">Subtotal</span>
                  <strong>{formatCurrency(subtotalAmount)}</strong>
                </div>
                <div>
                  <span className="muted-line">Desconto</span>
                  <strong>{formatCurrency(discountAmount)}</strong>
                </div>
                <div>
                  <span className="muted-line">Total</span>
                  <strong className="success">{formatCurrency(totalAmount)}</strong>
                </div>
              </div>
            </Card>

            <Card className="final-card">
              <h3>Formas de Pagamento</h3>
              <div className="final-payment-list">
                {payments.map((payment) => (
                  <div key={payment.method} className="final-payment-item">
                    <span>{payment.label}</span>
                    <strong>{formatCurrency(payment.amount)}</strong>
                  </div>
                ))}
              </div>
            </Card>

            <div className="payment-actions">
              <Button
                variant="ghost"
                shortcut="F11"
                onClick={() => {
                  setStep("PAYMENT");
                  setStatusMessage("Retorno para a tela de pagamento.");
                }}
                style={{ maxWidth: 280 }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <ArrowLeft size={18} />
                  Voltar para pagamento
                </span>
              </Button>
              <Button variant="success" shortcut="F12" onClick={() => void finalizeSale()} style={{ maxWidth: 280 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <Wallet size={20} />
                  Concluir venda
                </span>
              </Button>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="pdv-footer">
        <div className="footer-status">
          <span className="footer-message">{statusMessage}</span>
          <span className={`network-state ${online ? "online" : "offline"}`}>
            <StatusDot online={online && !lastSyncError} />
            {online ? "Online" : "Offline"} · {syncPending} pendência(s) de sync
          </span>
        </div>
        {lastSyncError ? <div className="error-strip">Último erro de sincronização: {lastSyncError}</div> : null}
        <div className="shortcut-row">
          F2 = Buscar Produto/Serviço &nbsp; F3 = Adicionar Produto &nbsp; F4 = Alterar quantidade
          &nbsp; F6 = Remover produto/serviço &nbsp; F8 = Finalizar Venda &nbsp; F10 = Desconto
        </div>
      </footer>

      {settingsOpen ? (
        <div className="settings-overlay" role="presentation">
          <div className="settings-panel">
            <div className="settings-header">
              <div>
                <h2>Configuração do PDV</h2>
                <p>Esses dados controlam sincronização, contexto operacional e operador logado.</p>
              </div>
              <button type="button" className="settings-close" onClick={() => setSettingsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="settings-grid">
              <label className="settings-field">
                <span>URL da API</span>
                <input value={settingsDraft.apiBaseUrl} onChange={(event) => updateSettingsDraft("apiBaseUrl", event.target.value)} />
              </label>
              <label className="settings-field">
                <span>Terminal / PDV</span>
                <input value={settingsDraft.terminalId} onChange={(event) => updateSettingsDraft("terminalId", event.target.value)} />
              </label>
              <label className="settings-field" style={{ gridColumn: "1 / -1" }}>
                <span>Token da sessão cloud</span>
                <input
                  value={settingsDraft.sessionToken}
                  onChange={(event) => updateSettingsDraft("sessionToken", event.target.value)}
                  placeholder="Cole o token gerado pelo login da API"
                />
              </label>
              <label className="settings-field">
                <span>Organização</span>
                <input
                  value={settingsDraft.organizationId}
                  onChange={(event) => updateSettingsDraft("organizationId", event.target.value)}
                />
              </label>
              <label className="settings-field">
                <span>Loja</span>
                <input value={settingsDraft.storeId} onChange={(event) => updateSettingsDraft("storeId", event.target.value)} />
              </label>
              <label className="settings-field">
                <span>Operador ID</span>
                <input
                  value={settingsDraft.operatorId}
                  onChange={(event) => updateSettingsDraft("operatorId", event.target.value)}
                />
              </label>
              <label className="settings-field">
                <span>Nome do operador</span>
                <input
                  value={settingsDraft.operatorName}
                  onChange={(event) => updateSettingsDraft("operatorName", event.target.value)}
                />
              </label>
              <label className="settings-field">
                <span>E-mail do operador</span>
                <input
                  value={settingsDraft.operatorEmail}
                  onChange={(event) => updateSettingsDraft("operatorEmail", event.target.value)}
                />
              </label>
            </div>

            <div className="settings-note">
              <strong>Diagnóstico</strong>
              <span>Pendências de sync: {syncPending}</span>
              <span>Último erro: {lastSyncError ?? "nenhum"}</span>
            </div>

            <div className="settings-actions">
              <button type="button" className="settings-secondary" onClick={() => void runSync()} disabled={syncBusy}>
                <RefreshCcw size={16} />
                Sincronizar
              </button>
              <button type="button" className="settings-primary" onClick={() => void saveSettings()} disabled={savingSettings}>
                <Save size={16} />
                {savingSettings ? "Salvando..." : "Salvar configuração"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
