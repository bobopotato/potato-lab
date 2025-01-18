import { Router } from "express";
import { jobInit } from "./scrapper.controller";

const scrapperRouter = Router();

scrapperRouter.post("/job/init", jobInit);

export default scrapperRouter;
