import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a DIRECT (non-pooled) connection; Neon's pooler (PgBouncer, transaction mode)
    // breaks Prisma Migrate. Falls back to DATABASE_URL for local Postgres, which has no pooler.
    url: process.env.DATABASE_URL_UNPOOLED || env("DATABASE_URL"),
  },
});
