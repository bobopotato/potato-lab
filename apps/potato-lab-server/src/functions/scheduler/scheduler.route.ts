import { Router } from "express";
import {
  createScheduler,
  getSchedulers,
  updateScheduler,
  deleteScheduler
} from "./scheduler.controller";

const schedulerRouter = Router();

schedulerRouter.post("/", createScheduler);
schedulerRouter.put("/", updateScheduler);
schedulerRouter.get("/", getSchedulers);
schedulerRouter.delete("/", deleteScheduler);

export default schedulerRouter;
