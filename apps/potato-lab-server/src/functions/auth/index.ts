import { appGenerator } from "../../infra/app.infra";
import errorHandler from "../../middlewares/error-handler.middleware";
import authRouter from "./auth.route";

const app = appGenerator({ isPublicRoute: true });
app.use("/auth", authRouter);
app.use(errorHandler);

export default app;
