import { SQS } from "@aws-sdk/client-sqs";
import { Request, Response } from "express";
import { getSchedulerById } from "./scrapper.service";
import { z } from "zod";
import { analyzeSchema } from "./receivers/job-scrapper.strategy";
import { baseConfig } from "../../configs";

export const jobInit = async (req: Request, res: Response) => {
  // body from event bridge is buffer type
  let body = req.body;
  if (req.body instanceof Buffer) {
    body = JSON.parse(req.body.toString("utf-8"));
  }

  console.log(`jobInit req`, {
    originalReq: JSON.stringify(req.body),
    parsedReq: body
  });

  const schema = z.object({
    id: z.string()
  });
  const { id } = schema.parse(body);
  const data = await getSchedulerById(id);

  if (!data.keywords?.length) {
    res.badRequest({
      message: "No keywords found in scheduler",
      data
    });
    return;
  }

  const sqs = new SQS({
    region: "ap-southeast-1"
  });

  const sendMessagePromises = data.keywords
    .map((keyword) => {
      return data.sourcePlatform.map((sourcePlatform) =>
        (async () => {
          // send sqs message
          console.info("Sending SQS Message", { id, keyword });
          await sqs.sendMessage({
            QueueUrl: baseConfig.awsJobScrapperAnalyzeQueueName,
            MessageBody: JSON.stringify({
              id,
              keyword,
              sourcePlatform
            } as z.infer<typeof analyzeSchema>)
          });
          console.info("Done with SQS Message", { id, keyword });
        })()
      );
    })
    .flat();

  await Promise.all(sendMessagePromises);
  console.info("Job Initiated", {
    data,
    sendMessagePromises
  });
  res.ok();
};
