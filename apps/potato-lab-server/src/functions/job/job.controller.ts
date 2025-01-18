import { Request, Response } from "express";
import { z } from "zod";
import * as jobService from "./job.service";
import { booleanSchema } from "@potato-lab/shared-types";

const paginationTransformer = <T extends { page?: number; pageSize?: number }>(
  val: T
) => {
  return {
    ...val,
    pagination:
      val?.page && val?.pageSize
        ? { page: val.page, pageSize: val.pageSize }
        : undefined
  };
};

export const getJobs = async (req: Request, res: Response) => {
  const schema = z
    .object({
      schedulerId: z.string(),
      keyword: z.string().optional(),
      page: z.coerce.number().optional(),
      pageSize: z.coerce.number().optional()
    })
    .transform(paginationTransformer);
  const { schedulerId, keyword, pagination } = schema.parse(req.query);
  const data = await jobService.getJobs(schedulerId, keyword, pagination);
  res.ok({ data });
};

export const getFavouriteJobs = async (req: Request, res: Response) => {
  const schema = z
    .object({
      schedulerId: z.string(),
      page: z.coerce.number().optional(),
      pageSize: z.coerce.number().optional()
    })
    .transform(paginationTransformer);
  const { schedulerId, pagination } = schema.parse(req.query);
  const data = await jobService.getFavouriteJobs(schedulerId, pagination);
  res.ok({ data });
};

export const updateJobFavourite = async (req: Request, res: Response) => {
  const schema = z.object({
    id: z.string(),
    isFavourite: booleanSchema
  });
  const { id, isFavourite } = schema.parse(req.params);
  const data = await jobService.updateJobFavourite(id, isFavourite);
  res.ok({
    data
  });
};
