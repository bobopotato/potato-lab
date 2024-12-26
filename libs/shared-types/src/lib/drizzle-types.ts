import { InferSelectModel } from "drizzle-orm";
import * as drizzleSchema from "@potato-lab/db";
// import { createSelectSchema } from "drizzle-zod";
// import { z } from "zod";

// export const userSelectSchema = createSelectSchema(drizzleSchema.userTable);

// export type User = z.infer<typeof userSelectSchema>;
export type User = InferSelectModel<typeof drizzleSchema.userTable>;
export type Portfolio = InferSelectModel<typeof drizzleSchema.portfolioTable>;
export type Position = InferSelectModel<typeof drizzleSchema.positionTable>;
