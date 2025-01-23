import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { jobCompanyInfoTable, jobTable } from "@potato-lab/db";
import { paginationResponseSchema } from "./common.schema";

export const jobSchema = createSelectSchema(jobTable).extend({
  jobListedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export const jobCompanyInfoSchema = createSelectSchema(jobCompanyInfoTable);

export const insertJobSchema = createInsertSchema(jobTable);
export const insertJobCompanyInfoSchema =
  createInsertSchema(jobCompanyInfoTable);

export const jobQuerySchema = z.object({
  data: jobSchema.array(),
  pagination: paginationResponseSchema.optional()
});

const jobWithCompanyInfoSchema = jobCompanyInfoSchema.extend({
  jobs: jobSchema.array()
});

export const jobWithCompanyInfoQuerySchema = jobWithCompanyInfoSchema.array();

export type Job = z.infer<typeof jobSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobWithCompanyInfo = z.infer<typeof jobWithCompanyInfoSchema>;
export type InsertJobCompanyInfo = z.infer<typeof insertJobCompanyInfoSchema>;
