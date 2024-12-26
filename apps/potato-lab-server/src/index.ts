import serverless from "serverless-http";

import authApp from "./functions/auth";
import dashboardApp from "./functions/dashboard";

export const authHandler = serverless(authApp);
export const dashboardHandler = serverless(dashboardApp);
