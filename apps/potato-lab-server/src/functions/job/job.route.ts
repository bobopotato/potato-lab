import { Router } from "express";
import {
  getFavouriteJobs,
  getJobs,
  updateJobFavourite
} from "./job.controller";

const jobRouter = Router();

jobRouter.get("/", getJobs);
jobRouter.get("/favourite", getFavouriteJobs);
jobRouter.put("/favourite", updateJobFavourite);

export default jobRouter;
