import { baseConfig } from "apps/potato-lab-server/src/configs";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: baseConfig.databaseUrl
});
export const db = drizzle({ client: pool, logger: true });
