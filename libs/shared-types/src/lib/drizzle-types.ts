import { InferSelectModel } from "drizzle-orm";
import { userTable, portfolioTable, positionTable } from "@potato-lab/db";

export type User = InferSelectModel<typeof userTable>;
export type Portfolio = InferSelectModel<typeof portfolioTable>;
export type Position = InferSelectModel<typeof positionTable>;
