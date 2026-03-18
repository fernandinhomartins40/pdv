import cookie from "@fastify/cookie";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { authRoutes } from "./modules/auth/routes";
import { dashboardRoutes } from "./modules/dashboard/routes";
import { productRoutes } from "./modules/products/routes";
import { salesRoutes } from "./modules/sales/routes";
import { stockRoutes } from "./modules/stock/routes";
import { syncRoutes } from "./modules/sync/routes";
import { xmlRoutes } from "./modules/xml/routes";
import { requireAuth } from "./lib/auth";

export async function createServer() {
  const app = Fastify({
    logger: true
  });

  await app.register(cookie);

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(",").map((item) => item.trim()) ?? true,
    credentials: true
  });

  await app.register(rateLimit, {
    global: false
  });

  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString()
  }));

  await app.register(authRoutes, { prefix: "/v1" });

  await app.register(
    async (instance) => {
      instance.addHook("preHandler", requireAuth);
      await dashboardRoutes(instance);
      await productRoutes(instance);
      await stockRoutes(instance);
      await salesRoutes(instance);
      await syncRoutes(instance);
      await xmlRoutes(instance);
    },
    { prefix: "/v1" }
  );

  return app;
}
