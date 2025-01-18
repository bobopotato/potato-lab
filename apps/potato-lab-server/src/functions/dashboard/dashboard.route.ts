// import {
//   EventBridge,
//   PutRuleCommandInput,
//   PutTargetsCommand,
//   PutTargetsCommandInput,
//   PutTargetsCommandOutput,
//   ApiDestination,
//   InputTransformer
// } from "@aws-sdk/client-eventbridge";
// import {
//   LambdaClient,
//   AddPermissionCommand,
//   RemovePermissionCommand,
//   RemovePermissionCommandInput
// } from "@aws-sdk/client-lambda";
import { Router, Request, Response } from "express";

const dashboardRouter = Router();

dashboardRouter.post("/test-auth", (req: Request, res: Response) => {
  return res.ok();
});

// dashboardRouter.post("/test-scheduler", async (req: Request, res: Response) => {
//   const id = req.body.id;
//   const uniqueName = `scheduler-${id}`;

//   try {
//     const ruleParams: PutRuleCommandInput = {
//       Name: uniqueName,
//       ScheduleExpression: `cron(*/1 * * * ? *)`,
//       State: "ENABLED"
//       // RoleArn:
//       //   "arn:aws:iam::767397903484:role/potato-lab-services-staging-us-east-1-lambdaRole"
//     };

//     const eventBridge = new EventBridge({
//       region: "ap-southeast-1"
//     });

//     // put new rule
//     await eventBridge.putRule(ruleParams);

//     // put new api destination
//     // const apiDestination: ApiDestination = {
//     //   ConnectionArn: "arn:aws:apigateway:ap-southeast-1::/restapis/2q8o5t6s4i",
//     //   HttpMethod: "POST",
//     // }

//     const targetParams: PutTargetsCommandInput = {
//       Rule: uniqueName,
//       Targets: [
//         {
//           Id: "1",
//           Arn: "arn:aws:lambda:ap-southeast-1:767397903484:function:serverless-potato-lab-staging-scrapperApi", // TODO: update production
//           Input: JSON.stringify({
//             version: "2.0",
//             rawPath: "/scrapper/job/init",
//             requestContext: {
//               http: {
//                 method: "POST",
//                 path: "/scrapper/job/init",
//                 protocol: "HTTP/1.1"
//               }
//             },
//             body: {
//               id: id,
//               test: "1233333"
//             }
//           })
//         }
//       ]
//     };

//     await eventBridge.putTargets(targetParams);

//     const lambdaClient = new LambdaClient({ region: "ap-southeast-1" });
//     const permissionParams = {
//       FunctionName: "serverless-potato-lab-staging-scrapperApi", // Replace with your Lambda function name
//       StatementId: uniqueName, // Unique statement ID
//       Action: "lambda:InvokeFunction", // Action to allow
//       Principal: "events.amazonaws.com", // EventBridge service principal
//       SourceArn: `arn:aws:events:ap-southeast-1:767397903484:rule/${uniqueName}` // ARN of your EventBridge rule
//     };
//     await lambdaClient.send(new AddPermissionCommand(permissionParams));
//     // await eventBridge.putPermission({
//     //   EventBusName: uniqueName,
//     //   Action: "lambda:InvokeFunction",
//     //   Principal: "*",
//     //   StatementId: uniqueName
//     // });
//     console.log(`done!`);
//   } catch (err) {
//     console.log(`zzz`);
//     console.log(err);
//   }

//   res.ok();
// });

// dashboardRouter.post(
//   "/delete-scheduler",
//   async (req: Request, res: Response) => {
//     const id = req.body.id;
//     const uniqueName = `scheduler-${id}`;

//     const eventBridge = new EventBridge({
//       region: "ap-southeast-1"
//     });

//     await eventBridge.removeTargets({
//       Rule: uniqueName,
//       Ids: ["1"]
//     });
//     await eventBridge.deleteRule({ Name: uniqueName });

//     const lambdaClient = new LambdaClient({ region: "ap-southeast-1" });
//     const permissionParams: RemovePermissionCommandInput = {
//       FunctionName: "serverless-potato-lab-staging-scrapperApi", // Replace with your Lambda function name
//       StatementId: uniqueName // Unique statement ID
//     };
//     await lambdaClient.send(new RemovePermissionCommand(permissionParams));

//     res.ok();
//   }
// );

export default dashboardRouter;
