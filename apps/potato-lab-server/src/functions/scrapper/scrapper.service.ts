import { merge } from "lodash";
import { eq } from "drizzle-orm";
import { InsertJob, InsertSchedulerRecord } from "@potato-lab/shared-types";
import {
  conflictUpdateAllExcept,
  jobTable,
  schedulerRecordTable,
  schedulerTable
} from "@potato-lab/db";
import { db } from "../../db";

export const getSchedulerById = async (id: string) => {
  const [data] = await db
    .selectDistinct()
    .from(schedulerTable)
    .where(eq(schedulerTable.id, id));

  return data;
};

export const insertJobData = async (data: InsertJob[]) => {
  await db
    .insert(jobTable)
    .values(data)
    .onConflictDoUpdate({
      target: jobTable.id,
      set: conflictUpdateAllExcept(jobTable, [
        "id",
        "isFavourite",
        "schedulerId"
      ])
    });
};

export const insertOrUpdateSchedulerRecordData = async (
  data: InsertSchedulerRecord
) => {
  const schedulerRecord = await db.transaction(
    async (tx) => {
      const [existingData] = await tx
        .select({
          id: schedulerRecordTable.id,
          record: schedulerRecordTable.record
        })
        .from(schedulerRecordTable)
        .where(eq(schedulerRecordTable.schedulerId, data.schedulerId))
        .for("update");

      if (!existingData) {
        const [schedulerRecord] = await tx
          .insert(schedulerRecordTable)
          .values(data)
          .returning();
        return schedulerRecord;
      }

      const { id, record } = existingData;
      const combinedRecord = merge(record, data.record);

      const [schedulerRecord] = await tx
        .update(schedulerRecordTable)
        .set({
          record: combinedRecord,
          lastTriggerAt: data.lastTriggerAt,
          lastEndAt: data.lastEndAt
        })
        .where(eq(schedulerRecordTable.id, id))
        .returning();

      return schedulerRecord;
    },
    {
      isolationLevel: "read committed"
    }
  );

  if (!schedulerRecord) {
    throw new Error(
      `Failed to insert or update scheduler record: JSON.stringify(data)`
    );
  }

  return schedulerRecord;
};

export const updateSchedulerRecordCount = async (
  schedulerRecordId: string,
  keyword: string,
  successCount: number,
  failedCount: number
) => {
  await db.transaction(
    async (tx) => {
      const [{ record: _record }] = await tx
        .select({ record: schedulerRecordTable.record })
        .from(schedulerRecordTable)
        .where(eq(schedulerRecordTable.id, schedulerRecordId))
        .for("update");

      const keywordRecord = _record?.[keyword];

      if (!keywordRecord) {
        throw new Error(`Keyword not found ${schedulerRecordId}, ${keyword}`);
      }

      const _currentCount = keywordRecord.currentCount + successCount;
      const _failedCount = keywordRecord.failedCount + failedCount;

      const record = {
        ..._record,
        [keyword]: {
          ..._record?.[keyword],
          currentCount: _currentCount,
          failedCount: _failedCount
        }
      };

      const MINIMUM_ALLOWED_COUNT_DIFFERENCE = 5;
      await tx
        .update(schedulerRecordTable)
        .set({
          record: record,
          lastEndAt:
            Math.abs(_currentCount + _failedCount - keywordRecord.totalCount) <=
            MINIMUM_ALLOWED_COUNT_DIFFERENCE
              ? new Date()
              : null
        })
        .where(eq(schedulerRecordTable.id, schedulerRecordId));
    },
    {
      isolationLevel: "read committed"
    }
  );
};
