import { appGenerator } from "../../infra/app.infra";
import errorHandler from "../../middlewares/error-handler.middleware";
import jobRouter from "./job.route";

const app = appGenerator();
app.use("/job", jobRouter);
app.use(errorHandler);
export default app;
