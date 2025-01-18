import { appGenerator } from "../../infra/app.infra";
import errorHandler from "../../middlewares/error-handler.middleware";
import scrapperRouter from "./scrapper.route";

const app = appGenerator({ isPublicRoute: true });
app.use("/scrapper", scrapperRouter);
app.use(errorHandler);
export default app;

export * from "./receivers/job-scrapper.receiver";
