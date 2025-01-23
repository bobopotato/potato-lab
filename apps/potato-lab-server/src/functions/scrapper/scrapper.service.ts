import { merge } from "lodash";
import { eq, ilike } from "drizzle-orm";
import {
  InsertJob,
  InsertJobCompanyInfo,
  InsertSchedulerRecord,
  Job,
  UpdateSchedulerRecord
} from "@potato-lab/shared-types";
import {
  conflictUpdateAllExcept,
  jobCompanyInfoNotExistTable,
  jobCompanyInfoTable,
  jobTable,
  schedulerRecordTable,
  schedulerTable
} from "@potato-lab/db";
import { db } from "../../db";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import { baseConfig } from "../../configs";

export const getSchedulerById = async (id: string) => {
  const [data] = await db
    .selectDistinct()
    .from(schedulerTable)
    .where(eq(schedulerTable.id, id));

  return data;
};

const markAsGoogleMapNotExist = async (
  data: Pick<Job, "id" | "companyName">
) => {
  // if no data found then insert as not exist
  // then update the company info not exist id
  const [jobCompanyInfoNotExistId] = await db
    .insert(jobCompanyInfoNotExistTable)
    .values({
      name: data.companyName
    })
    .returning();

  await db
    .update(jobTable)
    .set({ companyInfoNotExistId: jobCompanyInfoNotExistId.id })
    .where(eq(jobTable.id, data.id));
};

const insertCompanyInfo = async (
  data: Pick<
    Job,
    "id" | "companyName" | "companyInfoId" | "companyInfoNotExistId"
  >
) => {
  if (data.companyInfoId || data.companyInfoNotExistId) {
    // skip if already checked before
    console.info("company info already checked", data);
    return;
  }

  const [notExist] = await db
    .select()
    .from(jobCompanyInfoNotExistTable)
    .where(ilike(jobCompanyInfoNotExistTable.name, data.companyName));

  if (notExist) {
    // if previously called google api and get company info not exist
    // then skip it to avoid duplicate call (save $$)
    console.info("company info not exist", data);
    return;
  }

  // check if db has existing similar company info
  const [companyInfo] = await db
    .select()
    .from(jobCompanyInfoTable)
    .where(ilike(jobCompanyInfoTable.name, data.companyName));

  if (companyInfo) {
    // if got then update the company info id
    console.log("similar company info found in db", data);
    await db
      .update(jobTable)
      .set({ companyInfoId: companyInfo.id })
      .where(eq(jobTable.id, data.id));
    return;
  }

  // if not call google api to get company info and insert
  const client = new Client({});
  const placeResponse = await client.findPlaceFromText({
    params: {
      input: data.companyName,
      inputtype: PlaceInputType.textQuery,
      key: baseConfig.googleMapApiKey
    }
  });

  const placeData = placeResponse.data;

  if (!placeData.candidates?.[0]?.place_id) {
    console.info("placeData not found", data);
    await markAsGoogleMapNotExist(data);
    return;
  }

  // if has placeData -> call placeDetails google api
  const placeDetailsResponse = await client.placeDetails({
    params: {
      place_id: placeData.candidates[0].place_id,
      key: baseConfig.googleMapApiKey
    }
  });

  const placeDetailsData = placeDetailsResponse.data.result;

  if (
    placeDetailsData.geometry?.location.lat == null ||
    placeDetailsData.geometry?.location.lng == null
  ) {
    console.log("placeDetailsData lat and lng null", data);
    await markAsGoogleMapNotExist(data);
    return;
  }

  const _data: InsertJobCompanyInfo = {
    name: data.companyName,
    businessName: placeDetailsData.name || data.companyName,
    openingHours: placeDetailsData.opening_hours?.weekday_text,
    address: placeDetailsData.formatted_address,
    locationGeometry: [
      placeDetailsData.geometry.location.lat,
      placeDetailsData.geometry.location.lng
    ],
    phoneNumber:
      placeDetailsData.international_phone_number ||
      placeDetailsData.formatted_phone_number,
    mapUrl: placeDetailsData.url || "",
    website: placeDetailsData.website
  };

  console.info("placeDetailsData found & inserting company info", data);

  const [jobCompanyInfoId] = await db
    .insert(jobCompanyInfoTable)
    .values(_data)
    .returning();

  await db
    .update(jobTable)
    .set({ companyInfoId: jobCompanyInfoId.id })
    .where(eq(jobTable.id, data.id));
};

export const insertJobData = async (data: InsertJob[]) => {
  const jobs = await db
    .insert(jobTable)
    .values(data)
    .onConflictDoUpdate({
      target: jobTable.id,
      set: conflictUpdateAllExcept(jobTable, [
        "id",
        "isFavourite",
        "schedulerId"
      ])
    })
    .returning();

  // insert job company info
  const batchSize = 3;
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    const promises = batch.map((job) => () => {
      return insertCompanyInfo(job);
    });
    console.info("Inserting job company info", {
      batch: i,
      total: jobs.length
    });
    await Promise.allSettled(promises.map((fn) => fn()));
  }
};

export const insertSchedulerRecordData = async (
  data: InsertSchedulerRecord
) => {
  const [result] = await db
    .insert(schedulerRecordTable)
    .values(data)
    .returning();
  return result;
};

export const updateSchedulerRecordData = async (
  data: Partial<UpdateSchedulerRecord> &
    Required<Pick<UpdateSchedulerRecord, "id">>
) => {
  await db.transaction(
    async (tx) => {
      const [existingData] = await tx
        .select({
          record: schedulerRecordTable.record
        })
        .from(schedulerRecordTable)
        .where(eq(schedulerRecordTable.id, data.id))
        .for("update");

      if (!existingData) {
        throw new Error(`Scheduler record not found ${JSON.stringify(data)}}`);
      }

      const { record } = existingData;
      const combinedRecord = merge(record, data.record);

      await tx
        .update(schedulerRecordTable)
        .set({
          record: combinedRecord,
          lastTriggerAt: data.lastTriggerAt,
          lastEndAt: data.lastEndAt
        })
        .where(eq(schedulerRecordTable.id, data.id));
    },
    {
      isolationLevel: "read committed"
    }
  );
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
