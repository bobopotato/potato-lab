import { z } from "zod";
import cronstrue from "cronstrue";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from "drizzle-zod";
import {
  schedulerRecordTable,
  schedulerTable,
  SourcePlatformType
} from "@potato-lab/db";
import { uniqueArray } from "./common.schema";

const _insertSchedulerSchema = createInsertSchema(schedulerTable);
const _updateSchedulerSchema = createUpdateSchema(schedulerTable);
const _selectSchedulerSchema = createSelectSchema(schedulerTable);
const _insertSchedulerRecordSchema = createInsertSchema(schedulerRecordTable);
const _updateSchedulerRecordSchema = createUpdateSchema(schedulerRecordTable);
const _selectSchedulerRecordSchema = createSelectSchema(schedulerRecordTable);

const _commonSchame = z.object({
  description: z.string().optional(),
  frequencyExpression: z.string().superRefine((value, ctx) => {
    try {
      cronstrue.toString(value);
    } catch (e) {
      console.log(e);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid cron expression.`,
        fatal: true
      });
      return z.NEVER;
    }
  }),
  sourcePlatform: z.array(z.nativeEnum(SourcePlatformType)).nonempty(),
  keywords: uniqueArray(z.string(), true),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
});

export const insertSchedulerSchema = z
  .object(_insertSchedulerSchema.shape)
  .extend(_commonSchame.shape)
  .omit({ userId: true });

export const updateSchedulerSchema = z
  .object(_updateSchedulerSchema.shape)
  .extend(_commonSchame.shape)
  .required({
    id: true
  });

export const selectSchedulerSchema = z
  .object(_selectSchedulerSchema.shape)
  .extend({
    records: z
      .array(
        z.object({
          id: _selectSchedulerRecordSchema.shape.id,
          record: _selectSchedulerRecordSchema.shape.record.nullable(),
          lastTriggerAt: z.coerce.date().optional(),
          lastEndAt: z.coerce.date().optional()
        })
      )
      .nullable()
  })
  .extend(_commonSchame.shape);

export const insertSchedulerRecordSchema = z.object(
  _insertSchedulerRecordSchema.shape
);

export const updateSchedulerRecordSchema = z
  .object(_updateSchedulerRecordSchema.shape)
  .required({
    schedulerId: true
  });

export type InsertScheduler = z.infer<typeof insertSchedulerSchema>;
export type UpdateScheduler = z.infer<typeof updateSchedulerSchema>;

export type InsertSchedulerRecord = z.infer<typeof insertSchedulerRecordSchema>;
export type UpdateSchedulerRecord = z.infer<typeof updateSchedulerRecordSchema>;

export type SelectScheduler = z.infer<typeof selectSchedulerSchema>;
