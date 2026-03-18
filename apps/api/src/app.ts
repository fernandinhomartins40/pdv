import Fastify from "fastify";
import cors from "@fastify/cors";
import { dashboardRoutes } from "./modules/dashboard/routes";
import { productRoutes } from "./modules/products/routes";
import { salesRoutes } from "./modules/sales/routes";
import { stockRoutes } from "./modules/stock/routes";
import { syncRoutes } from "./modules/sync/routes";
import { xmlRoutes } from "./modules/xml/routes";

export async function createServer() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: true
  });

  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString()
  }));

  await app.register(
    async (instance) => {
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
