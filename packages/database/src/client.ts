import { PrismaClient } from "@prisma/client";

declare global {
  var __pdvPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__pdvPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pdvPrisma__ = prisma;
}
