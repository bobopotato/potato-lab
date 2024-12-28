import "dotenv/config";
import { createDatabase, createDatabaseConfig } from "@potato-lab/db";
import { baseConfig } from "../configs";

export const db = createDatabase(baseConfig.databaseUrl);

const databaseConfig = createDatabaseConfig(baseConfig.databaseUrl);
export default databaseConfig;
