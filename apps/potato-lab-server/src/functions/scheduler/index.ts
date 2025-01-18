import { appGenerator } from "../../infra/app.infra";
import errorHandler from "../../middlewares/error-handler.middleware";
import schedulerRouter from "./scheduler.route";

const app = appGenerator();
app.use("/scheduler", schedulerRouter);
app.use(errorHandler);
export default app;
