import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./src/configs/index";

export default defineConfig({
  out: "apps/potato-lab-server/drizzle/migrations",
  schema: "apps/potato-lab-server/drizzle/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: baseConfig.databaseUrl
  },
  verbose: true,
  strict: true
});
