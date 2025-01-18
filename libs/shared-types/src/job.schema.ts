import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { jobTable } from "@potato-lab/db";
import { paginationResponseSchema } from "./common.schema";

export const jobSchema = createSelectSchema(jobTable).extend({
  jobListedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export const insertJobSchema = createInsertSchema(jobTable);

export const jobQuerySchema = z.object({
  data: jobSchema.array(),
  pagination: paginationResponseSchema.optional()
});

export type Job = z.infer<typeof jobSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
