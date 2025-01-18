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
      set: conflictUpdateAllExcept(jobTable, ["id", "isFavourite"])
    });
};

export const insertOrUpdateSchedulerRecordData = async (
  data: InsertSchedulerRecord
) => {
  await db.transaction(
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
        await tx.insert(schedulerRecordTable).values(data);
        return;
      }

      const { id, record } = existingData;
      const combinedRecord = merge(record, data.record);

      await tx
        .update(schedulerRecordTable)
        .set({
          record: combinedRecord,
          lastTriggerAt: data.lastTriggerAt,
          lastEndAt: data.lastEndAt
        })
        .where(eq(schedulerRecordTable.id, id));
    },
    {
      isolationLevel: "read committed"
    }
  );
};

export const updateSchedulerRecordCount = async (
  schedulerId: string,
  keyword: string,
  successCount: number,
  failedCount: number
) => {
  await db.transaction(
    async (tx) => {
      const [{ record: _record }] = await tx
        .select({ record: schedulerRecordTable.record })
        .from(schedulerRecordTable)
        .where(eq(schedulerRecordTable.schedulerId, schedulerId))
        .for("update");

      const keywordRecord = _record?.[keyword];

      if (!keywordRecord) {
        throw new Error(`Keyword not found ${schedulerId}, ${keyword}`);
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

      await tx
        .update(schedulerRecordTable)
        .set({
          record: record,
          lastEndAt:
            _currentCount === keywordRecord.totalCount ? new Date() : null
        })
        .where(eq(schedulerRecordTable.schedulerId, schedulerId));
    },
    {
      isolationLevel: "read committed"
    }
  );
};
