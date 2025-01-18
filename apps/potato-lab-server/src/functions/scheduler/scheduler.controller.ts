import {
  insertSchedulerSchema,
  updateSchedulerSchema
} from "@potato-lab/shared-types";
import { Request, Response } from "express";
import {
  createScheduler as createSchedulerService,
  updateScheduler as updateSchedulerService,
  getUserScheduler,
  createUpdateAwsScheduler,
  deleteAwsScheduler
} from "./scheduler.service";
import { z } from "zod";
import { StatusEnum } from "@potato-lab/db";

export const createScheduler = async (req: Request, res: Response) => {
  const data = insertSchedulerSchema.parse(req.body);
  const createdData = await createSchedulerService(data, req.user.id);
  await createUpdateAwsScheduler(
    createdData.id,
    createdData.frequencyExpression
  );
  res.ok();
};

export const updateScheduler = async (req: Request, res: Response) => {
  const data = updateSchedulerSchema.parse(req.body);
  const updatedData = await updateSchedulerService(data);
  await createUpdateAwsScheduler(
    updatedData.id,
    updatedData.frequencyExpression
  );
  res.ok({ data: updatedData });
};

export const getSchedulers = async (req: Request, res: Response) => {
  const data = await getUserScheduler(req.user.id);
  res.ok({ data });
};

export const deleteScheduler = async (req: Request, res: Response) => {
  const schema = z.object({
    id: z.string()
  });
  const { id } = schema.parse(req.body);
  await updateSchedulerService({ id, status: StatusEnum.INACTIVE });
  await deleteAwsScheduler(id);
  res.ok();
};
