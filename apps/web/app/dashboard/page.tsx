import { prisma } from "@pdv/database";
import { AppPageShell } from "../../components/app-page-shell";
import { DashboardContent } from "../../components/dashboard-content";
import { requireSession } from "../../lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const endOfYesterday = new Date(startOfToday.getTime() - 1);

  const [today, month, yesterday, pendingOrders, stockAlerts] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        organizationId: session.activeOrganizationId,
        storeId: session.activeStoreId ?? undefined,
        status: "COMPLETED",
        createdAt: {
          gte: startOfToday
        }
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    }),
    prisma.sale.aggregate({
      where: {
        organizationId: session.activeOrganizationId,
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth
        }
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    }),
    prisma.sale.aggregate({
      where: {
        organizationId: session.activeOrganizationId,
        status: "COMPLETED",
        createdAt: {
          gte: startOfYesterday,
          lte: endOfYesterday
        }
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    }),
    prisma.syncQueue.count({
      where: {
        storeId: session.activeStoreId ?? undefined,
        status: {
          in: ["FAILED", "CONFLICT", "PENDING"]
        }
      }
    }),
    prisma.product.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        isActive: true,
        stockBalances: {
          some: {
            storeId: session.activeStoreId ?? undefined
          }
        }
      },
      include: {
        stockBalances: {
          where: {
            storeId: session.activeStoreId ?? undefined
          }
        }
      },
      take: 6,
      orderBy: {
        updatedAt: "desc"
      }
    })
  ]);

  const snapshot = {
    soldOrders: [
      { label: "Este mes", count: month._count.id, amount: Number(month._sum.totalAmount ?? 0), accent: "#6B2EFF" },
      { label: "Hoje", count: today._count.id, amount: Number(today._sum.totalAmount ?? 0), accent: "#31C65B" },
      { label: "Ontem", count: yesterday._count.id, amount: Number(yesterday._sum.totalAmount ?? 0), accent: "#FF7A1A" }
    ],
    pendingOrders,
    tables: session.stores.slice(0, 3).map((store) => ({
      label: store.code,
      status: store.id === session.activeStoreId ? "Ativa" : "Disponivel",
      totalAmount: store.id === session.activeStoreId ? Number(today._sum.totalAmount ?? 0) : 0
    })),
    stockAlerts: stockAlerts
      .filter((item) => Number(item.stockBalances[0]?.quantity ?? 0) <= Number(item.minStock))
      .map((item) => ({
        productName: item.name,
        quantity: Number(item.stockBalances[0]?.quantity ?? 0),
        minStock: Number(item.minStock)
      }))
  };

  return (
    <AppPageShell>
      <DashboardContent snapshot={snapshot} />
    </AppPageShell>
  );
}
