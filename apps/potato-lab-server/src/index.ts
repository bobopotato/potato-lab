import serverless from "serverless-http";

import authApp from "./functions/auth";
import dashboardApp from "./functions/dashboard";
import schedulerApp from "./functions/scheduler";
import scrapperApp, {
  scrapperAnalzeReceiver,
  scrapperProcessReceiver
} from "./functions/scrapper";
import jobApp from "./functions/job";

export const authHandler = serverless(authApp);
export const dashboardHandler = serverless(dashboardApp);
export const schedulerHandler = serverless(schedulerApp);
export const scrapperHandler = serverless(scrapperApp);
export const jobHandler = serverless(jobApp);

export const jobScrapperAnalyzeReceiver = scrapperAnalzeReceiver;
export const jobScrapperProcessReceiver = scrapperProcessReceiver;
