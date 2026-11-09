import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here.
  // Postgres is always on (DATABASE_URL / DATABASE_URL_UNPOOLED) and backs the whole app via Prisma.
  auth: false,
  preview: {
    // Realtime powers live updates on the site (e.g. the announcement bar and event changes push instantly).
    // Browsers may only connect from these origins. Add the production domain when it's live.
    realtime: {
      allowedOrigins: ["http://localhost:3210", "https://indiehabitat.com"],
    },
  },
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
