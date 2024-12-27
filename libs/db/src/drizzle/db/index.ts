import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const createDatabase = (databaseUrl: string) => {
  const pool = new Pool({
    connectionString: databaseUrl
  });
  return drizzle({ client: pool, logger: true });
};
