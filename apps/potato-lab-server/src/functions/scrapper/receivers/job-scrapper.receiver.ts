import { SQSHandler } from "aws-lambda";
import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  SQSClient
} from "@aws-sdk/client-sqs";
import {
  analyzeSchema,
  JOB_SCRAPPER_STRATEGY,
  processSchema
} from "./job-scrapper.strategy";
import { baseConfig } from "../../../configs";

export const scrapperAnalzeReceiver: SQSHandler = async (event) => {
  let receiptHandle;

  try {
    for (const record of event.Records) {
      receiptHandle = record.receiptHandle;

      const messageBody = JSON.parse(record.body);
      const data = analyzeSchema.parse(messageBody);
      const strategy = JOB_SCRAPPER_STRATEGY[data.sourcePlatform];

      if (strategy) {
        await strategy.analyzeFn(data);

        const client = new SQSClient({
          region: baseConfig.awsRegion
        });
        const params: DeleteMessageCommandInput = {
          QueueUrl: baseConfig.awsJobScrapperAnalyzeQueueName,
          ReceiptHandle: receiptHandle
        };
        await client.send(new DeleteMessageCommand(params));
        console.info("Message Deleted");
      } else {
        throw new Error("Source Platform not supported");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const scrapperProcessReceiver: SQSHandler = async (event) => {
  let receiptHandle;

  try {
    for (const record of event.Records) {
      receiptHandle = record.receiptHandle;

      const messageBody = JSON.parse(record.body);
      const data = processSchema.parse(messageBody);
      const strategy = JOB_SCRAPPER_STRATEGY[data.sourcePlatform];

      if (strategy) {
        await strategy.processFn(data);

        const client = new SQSClient({
          region: baseConfig.awsRegion
        });
        const params: DeleteMessageCommandInput = {
          QueueUrl: baseConfig.awsJobScrapperProcessQueueName,
          ReceiptHandle: receiptHandle
        };
        await client.send(new DeleteMessageCommand(params));
        console.info("Message Deleted");
      } else {
        throw new Error("Source Platform not supported");
      }
    }
  } catch (error) {
    console.error(error);
  }
};
