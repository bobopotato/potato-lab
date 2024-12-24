import { Router, Request, Response } from "express";

const dashboardRouter = Router();

dashboardRouter.post("/test-auth", (req: Request, res: Response) => {
  return res.ok();
});

export default dashboardRouter;
