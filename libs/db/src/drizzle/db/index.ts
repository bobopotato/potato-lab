import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const createDatabase = (databaseUrl: string) => {
  console.log("databaseUrl", databaseUrl);
  console.log("env", process.env);
  const pool = new Pool({
    connectionString: databaseUrl
  });
  return drizzle({ client: pool, logger: true });
};
