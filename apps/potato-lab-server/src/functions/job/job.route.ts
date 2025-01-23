import { Router } from "express";
import {
  getFavouriteJobs,
  getJobs,
  getJobsCompanyInfo,
  updateJobFavourite
} from "./job.controller";

const jobRouter = Router();

jobRouter.get("/", getJobs);
jobRouter.get("/favourite", getFavouriteJobs);
jobRouter.put("/favourite", updateJobFavourite);
jobRouter.get("/jobs-company-info", getJobsCompanyInfo);

export default jobRouter;
