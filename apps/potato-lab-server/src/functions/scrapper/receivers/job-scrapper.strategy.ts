import { z } from "zod";
import { JobSourcePlatformEnum } from "@potato-lab/db";
import {
  getJobStreetData,
  getJobStreetDetails
} from "../utils/jobstreet.utils";
import {
  insertJobData,
  updateSchedulerRecordData,
  updateSchedulerRecordCount
} from "../scrapper.service";
import { SQS } from "@aws-sdk/client-sqs";
import { InsertJob } from "@potato-lab/shared-types";
import { baseConfig } from "../../../configs";

export const analyzeSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  sourcePlatform: z.nativeEnum(JobSourcePlatformEnum),
  schedulerRecordId: z.string()
});

export const processSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  jobIds: z.array(z.string()).nonempty(),
  sourcePlatform: z.nativeEnum(JobSourcePlatformEnum),
  schedulerRecordId: z.string()
});

export const jobStreetAnalyze = async (data: z.infer<typeof analyzeSchema>) => {
  const { id, keyword, sourcePlatform, schedulerRecordId } = data;

  console.info("Starting Jobstreet Analyze", { id, keyword });
  const firstPageData = await getJobStreetData(keyword, 1);

  if (!firstPageData) {
    throw new Error(
      JSON.stringify({
        message: "No keywords found in jobstreet analyze",
        data: { id, keyword }
      })
    );
  }

  const { totalJobsCount, jobIds } = firstPageData;
  const dataPerPage = jobIds.length;
  const jobIdsBatch = [jobIds];

  const getDataPromises: Array<() => Promise<void>> = [];

  for (let i = 2; i <= Math.ceil(totalJobsCount / dataPerPage); i++) {
    console.info("Getting Job Street Data", {
      id,
      keyword,
      i,
      totalPage: Math.ceil(totalJobsCount / dataPerPage),
      totalJobsCount,
      dataPerPage
    });

    getDataPromises.push(async () => {
      const data = await getJobStreetData(keyword, i);

      if (data?.jobIds) {
        jobIdsBatch.push(data.jobIds);
      }
    });
  }

  const batchSize = 5;

  for (let i = 0; i < getDataPromises.length; i += batchSize) {
    const batch = getDataPromises.slice(i, i + batchSize);
    const result = await Promise.allSettled(batch.map((fn) => fn()));
    console.info("result", { result });
  }

  await updateSchedulerRecordData({
    record: {
      [keyword]: {
        totalCount: totalJobsCount,
        currentCount: 0,
        failedCount: 0
      }
    },
    id: schedulerRecordId
  });

  const sqs = new SQS({
    region: "ap-southeast-1"
  });

  const sendMessagePromises = jobIdsBatch.map((jobIds: string[]) => {
    if (!jobIds.length) {
      return;
    }
    return sqs.sendMessage({
      QueueUrl: baseConfig.awsJobScrapperProcessQueueName,
      MessageBody: JSON.stringify({
        id,
        keyword,
        jobIds: jobIds as z.infer<typeof processSchema.shape.jobIds>,
        sourcePlatform,
        schedulerRecordId: schedulerRecordId
      } satisfies z.infer<typeof processSchema>)
    });
  });

  console.info("Sending Message Promises and insert Schduler Record Data", {
    id,
    keyword,
    jobIdsBatch,
    jobIdsBatchLength: jobIdsBatch.length
  });

  await Promise.all(sendMessagePromises);
  console.info("Job Street Analyze - Completed", { id, keyword });
};

export const jobStreetProcess = async (data: z.infer<typeof processSchema>) => {
  const { id, keyword, jobIds, schedulerRecordId } = data;

  // get details
  console.info("Getting job details", {
    id,
    schedulerRecordId,
    keyword,
    jobIds
  });

  const promises = jobIds.map((jobId) => async () => {
    return await getJobStreetDetails(jobId, id);
  });
  const batchSize = 3;
  const result: PromiseSettledResult<InsertJob>[] = [];

  for (let i = 0; i < promises.length; i += batchSize) {
    console.log(`running batch ${i}`);
    const batch = promises.slice(i, i + batchSize);
    const _result = await Promise.allSettled(batch.map((fn) => fn()));
    result.push(..._result);
  }

  const successDetails = result
    .filter((item) => item.status === "fulfilled")
    .map((item) => item.value);
  const failedDetails = result.filter((item) => item.status === "rejected");

  // insert into jobTable
  console.info("Inserting job data", {
    id,
    keyword,
    jobIds,
    // successDetails,
    successDetailsLength: successDetails.length,
    failedDetails: JSON.stringify(failedDetails),
    failedDetailsLength: failedDetails.length
  });
  if (successDetails.length) {
    await insertJobData(successDetails);
  }

  // update recordTable
  console.info("Updating sechdulerRecordCount", { id, keyword, jobIds });
  await updateSchedulerRecordCount(
    schedulerRecordId,
    keyword,
    successDetails.length,
    failedDetails.length
  );

  console.info("Job Street Process - Completed", { id, keyword });
};

export const JOB_SCRAPPER_STRATEGY: Record<
  JobSourcePlatformEnum,
  | {
      analyzeFn: (data: z.infer<typeof analyzeSchema>) => Promise<void>;
      processFn: (data: z.infer<typeof processSchema>) => Promise<void>;
    }
  | undefined
> = {
  [JobSourcePlatformEnum.JOBSTREET]: {
    analyzeFn: jobStreetAnalyze,
    processFn: jobStreetProcess
  },
  [JobSourcePlatformEnum.INDEED]: undefined
};
