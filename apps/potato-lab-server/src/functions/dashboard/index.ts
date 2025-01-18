import { appGenerator } from "../../infra/app.infra";
import errorHandler from "../../middlewares/error-handler.middleware";
import dashboardRouter from "./dashboard.route";

const app = appGenerator({ isPublicRoute: true });
app.use("/dashboard", dashboardRouter);
app.use(errorHandler);
export default app;
