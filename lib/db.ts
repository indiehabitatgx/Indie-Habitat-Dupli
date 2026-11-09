import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * App traffic uses the POOLED connection (DATABASE_URL, "-pooler" host).
 * - Neon: Neon's serverless driver (`@neondatabase/serverless`, WebSocket pool with transaction support) via
 *   `@prisma/adapter-neon`, the recommended driver for serverless hosts such as Netlify.
 * - Local Postgres (npm run local): node-postgres via `@prisma/adapter-pg`.
 * Migrations use the DIRECT connection (DATABASE_URL_UNPOOLED); see prisma.config.ts.
 */
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const isNeon = new URL(connectionString).hostname.endsWith(".neon.tech");
  const adapter = isNeon ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
