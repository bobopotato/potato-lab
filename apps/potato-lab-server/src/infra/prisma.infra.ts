import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// reference add [driverAdataper in schema.prisma] - https://www.prisma.io/docs/orm/overview/databases/postgresql
// reference add 'sslmode=no-verify' in .env files - https://stackoverflow.com/questions/78162737/prisma-cannot-connect-to-aws-rds-postgres-instance?rq=1
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
