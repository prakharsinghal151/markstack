import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL!
});

const isDevelopment = process.env.NODE_ENV === "development";

const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: isDevelopment ? ["query", "info", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = db;
}

export default db;
