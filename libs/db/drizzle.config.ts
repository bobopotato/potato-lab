import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./src/drizzle/configs";

export default defineConfig({
  out: "libs/db/src/drizzle/migrations",
  schema: "libs/db/src/drizzle/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: baseConfig.databaseUrl
  },
  verbose: true,
  strict: true
});
