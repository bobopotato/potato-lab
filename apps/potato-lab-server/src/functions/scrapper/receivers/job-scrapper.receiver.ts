import { SQSHandler } from "aws-lambda";
import {
  analyzeSchema,
  JOB_SCRAPPER_STRATEGY,
  processSchema
} from "./job-scrapper.strategy";

export const scrapperAnalzeReceiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      console.info("Message Body -->  ", record.body);
      const messageBody = JSON.parse(record.body);
      const data = analyzeSchema.parse(messageBody);
      const strategy = JOB_SCRAPPER_STRATEGY[data.sourcePlatform];

      if (strategy) {
        await strategy.analyzeFn(data);
      } else {
        throw new Error("Source Platform not supported");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const scrapperProcessReceiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      console.info("Message Body -->  ", record.body);
      const messageBody = JSON.parse(record.body);
      const data = processSchema.parse(messageBody);
      const strategy = JOB_SCRAPPER_STRATEGY[data.sourcePlatform];

      if (strategy) {
        await strategy.processFn(data);
      } else {
        throw new Error("Source Platform not supported");
      }
    }
  } catch (error) {
    console.error(error);
  }
};
