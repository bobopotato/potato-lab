import "express-async-errors";
import express from "express";
import cors from "cors";
import authenticateToken from "../middlewares/authentication.middleware";
import customMiddlewareParams from "../middlewares/custom-middleware-params.middleware";

const WHITE_LISTED_DOMAIN = ["http://localhost:4200", ""];

export const appGenerator = (
  {
    isPublicRoute = false
  }: {
    isPublicRoute?: boolean;
  } = { isPublicRoute: false }
) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (WHITE_LISTED_DOMAIN.indexOf(origin as string) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    })
  );

  app.use(customMiddlewareParams);

  if (!isPublicRoute) {
    app.use(authenticateToken);
  }

  return app;
};
