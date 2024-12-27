import { defineConfig } from "drizzle-kit";
import { resolve } from "path";
import { Config } from "drizzle-kit";

export const createDatabaseConfig = (databaseUrl: string): Config => {
  return defineConfig({
    dialect: "postgresql",
    verbose: true,
    strict: true,
    schema: resolve(__dirname, "./src/drizzle/db/schema.ts"),
    out: resolve(__dirname, "./src/drizzle/migrations"),
    dbCredentials: {
      url: databaseUrl
    }
  });
};

export default defineConfig({
  dialect: "postgresql",
  verbose: true,
  strict: true,
  schema: "./src/drizzle/db/schema.ts",
  out: "./src/drizzle/migrations"
});
