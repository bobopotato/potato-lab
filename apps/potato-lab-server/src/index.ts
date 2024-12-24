import "express-async-errors";
import express from "express";
import cors from "cors";

import authRouter from "./auth/auth.route";
import errorHandler from "./middlewares/error-handler.middleware";
import customResponse from "./middlewares/custom-response.middleware";
import dashboardRouter from "./dashboard/dashboard.route";
import authenticateToken from "./middlewares/authentication.middleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(customResponse);
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true
  })
);

/**
 * PUBLIC ROUTES
 */
app.use("/auth", authRouter);

/**
 * PRIVATE ROUTES
 */
app.use(authenticateToken);
app.use("/dashboard", dashboardRouter);

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to paotato-lab-server!" });
});

app.use(errorHandler); // This middleware should be the last one in the chain because it catches all the unhandled errors.

const port = process.env.PORT || 8888;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
