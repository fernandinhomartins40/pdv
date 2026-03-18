import { prisma } from "@pdv/database";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { endOfDay, previousMonth, startOfDay, startOfMonth } from "../../lib/time-window";
import { assertOrganizationAccess, assertStoreAccess } from "../../lib/auth";

async function aggregateWindow(organizationId: string, start: Date, end: Date) {
  const result = await prisma.sale.aggregate({
    where: {
      organizationId,
      status: "COMPLETED",
      createdAt: {
        gte: start,
        lte: end
      }
    },
    _count: {
      id: true
    },
    _sum: {
      totalAmount: true
    }
  });

  return {
    count: result._count.id,
    amount: Number(result._sum.totalAmount ?? 0)
  };
}

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/dashboard/overview", async (request) => {
    const query = z
      .object({
        organizationId: z.string().optional(),
        storeId: z.string().optional()
      })
      .parse(request.query);

    const organizationId = assertOrganizationAccess(request, query.organizationId);
    const storeId = assertStoreAccess(request, organizationId, query.storeId);

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const yesterdayStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const yesterdayEnd = endOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const currentMonthStart = startOfMonth(now);
    const previousMonthStart = previousMonth(now);
    const previousMonthEnd = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));

    const [previous, current, yesterday, today, stockAlerts] = await Promise.all([
      aggregateWindow(organizationId, previousMonthStart, previousMonthEnd),
      aggregateWindow(organizationId, currentMonthStart, todayEnd),
      aggregateWindow(organizationId, yesterdayStart, yesterdayEnd),
      aggregateWindow(organizationId, todayStart, todayEnd),
      prisma.product.findMany({
        where: {
          organizationId,
          stockBalances: {
            some: {
              storeId: storeId ?? undefined
            }
          }
        },
        include: {
          stockBalances: {
            where: {
              storeId: storeId ?? undefined
            }
          }
        },
        take: 8
      })
    ]);

    return {
      soldOrders: [
        { label: previousMonthStart.toLocaleString("pt-BR", { month: "short", year: "numeric" }), accent: "#6B2EFF", ...previous },
        { label: "Este Mês", accent: "#8A4DFF", ...current },
        { label: "Ontem", accent: "#FF7A1A", ...yesterday },
        { label: "Hoje", accent: "#32C450", ...today }
      ],
      pendingOrders: 2,
      tables: [
        { label: "1", status: "Ocupadas", totalAmount: 25 },
        { label: "2", status: "Ocupadas", totalAmount: 80 },
        { label: "18", status: "Livres", totalAmount: 0 }
      ],
      stockAlerts: stockAlerts
        .filter((item) => Number(item.stockBalances[0]?.quantity ?? 0) <= Number(item.minStock))
        .map((item) => ({
          productName: item.name,
          quantity: Number(item.stockBalances[0]?.quantity ?? 0),
          minStock: Number(item.minStock)
        }))
    };
  });
}
