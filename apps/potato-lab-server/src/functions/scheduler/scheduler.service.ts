import { InsertScheduler, UpdateScheduler } from "@potato-lab/shared-types";
import { db } from "../../db";
import { schedulerRecordTable, schedulerTable } from "@potato-lab/db";
import { eq, getTableColumns } from "drizzle-orm";
import {
  EventBridge,
  PutRuleCommandInput,
  PutTargetsCommandInput
} from "@aws-sdk/client-eventbridge";
import {
  AddPermissionCommand,
  LambdaClient,
  RemovePermissionCommand,
  RemovePermissionCommandInput,
  ResourceConflictException
} from "@aws-sdk/client-lambda";
import { baseConfig } from "../../configs";

export const createScheduler = async (
  data: InsertScheduler,
  userId: string
) => {
  const [createdData] = await db
    .insert(schedulerTable)
    .values({
      ...data,
      userId
    })
    .returning();
  return createdData;
};

export const updateScheduler = async (
  data: Partial<UpdateScheduler> & Required<Pick<UpdateScheduler, "id">>
) => {
  const [updatedData] = await db
    .update(schedulerTable)
    .set(data)
    .where(eq(schedulerTable.id, data.id))
    .returning();

  return updatedData;
};

export const getUserScheduler = async (userId: string) => {
  const data = await db
    .select({
      ...getTableColumns(schedulerTable),
      record: schedulerRecordTable.record,
      lastTriggerAt: schedulerRecordTable.lastTriggerAt,
      lastEndAt: schedulerRecordTable.lastEndAt
    })
    .from(schedulerTable)
    .leftJoin(
      schedulerRecordTable,
      eq(schedulerTable.id, schedulerRecordTable.schedulerId)
    )
    .where(eq(schedulerTable.userId, userId));

  return data;
};

export const createUpdateAwsScheduler = async (
  id: string,
  frequencyExpression: string
) => {
  const uniqueName = `scheduler-${id}`;

  const awsCronExpression = `${frequencyExpression
    .split(" ")
    .slice(0, -1)
    .join(" ")} ? *`;

  const ruleParams: PutRuleCommandInput = {
    Name: uniqueName,
    ScheduleExpression: `cron(${awsCronExpression})`,
    State: "ENABLED"
  };

  const eventBridge = new EventBridge({
    region: baseConfig.awsRegion
  });

  // put new rule
  await eventBridge.putRule(ruleParams);

  const targetParams: PutTargetsCommandInput = {
    Rule: uniqueName,
    Targets: [
      {
        Id: "1",
        Arn: baseConfig.awsScrapperLambdaArn,
        Input: JSON.stringify({
          version: "2.0",
          rawPath: "/scrapper/job/init",
          requestContext: {
            http: {
              method: "POST",
              path: "/scrapper/job/init",
              protocol: "HTTP/1.1"
            }
          },
          body: {
            id: id
          }
        })
      }
    ]
  };

  await eventBridge.putTargets(targetParams);

  const lambdaClient = new LambdaClient({ region: baseConfig.awsRegion });
  const permissionParams = {
    FunctionName: baseConfig.awsScrapperLambdaName,
    StatementId: uniqueName,
    Action: "lambda:InvokeFunction",
    Principal: "events.amazonaws.com",
    SourceArn: `${baseConfig.awsRuleArn}/${uniqueName}`
  };
  try {
    await lambdaClient.send(new AddPermissionCommand(permissionParams));
  } catch (err) {
    if (err instanceof ResourceConflictException) {
      console.log("Permission already exists. Skipping...");
      return;
    }
    throw err;
  }
};

export const deleteAwsScheduler = async (id: string) => {
  const uniqueName = `scheduler-${id}`;

  const eventBridge = new EventBridge({
    region: baseConfig.awsRegion
  });

  await eventBridge.removeTargets({
    Rule: uniqueName,
    Ids: ["1"]
  });
  await eventBridge.deleteRule({ Name: uniqueName });

  const lambdaClient = new LambdaClient({ region: baseConfig.awsRegion });
  const permissionParams: RemovePermissionCommandInput = {
    FunctionName: baseConfig.awsScrapperLambdaName,
    StatementId: uniqueName // Unique statement ID
  };
  await lambdaClient.send(new RemovePermissionCommand(permissionParams));
};
