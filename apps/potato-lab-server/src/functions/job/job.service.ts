import { JobListingStatusEnum, jobTable } from "@potato-lab/db";
import { db } from "../../db";
import { and, count, desc, eq, getTableColumns, gt, sql } from "drizzle-orm";

export const getJobs = async (
  schedulerId: string,
  keyword?: string,
  pagination?: {
    page: number;
    pageSize: number;
  }
) => {
  const offset = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
  const pageSize = pagination?.pageSize || null;
  let query;
  let countQuery;

  if (keyword?.length) {
    const similarityCTE = db.$with("similarity").as(
      db
        .select({
          ...getTableColumns(jobTable),
          similarity:
            sql<number>`word_similarity(${keyword}, "detailsTemplate")`.as(
              "similarity"
            )
        })
        .from(jobTable)
    );

    query = db
      .with(similarityCTE)
      .select()
      .from(similarityCTE)
      .where(
        and(
          eq(similarityCTE.schedulerId, schedulerId),
          eq(similarityCTE.jobListingStatus, JobListingStatusEnum.VALID),
          gt(similarityCTE.similarity, 0.5)
        )
      )
      .orderBy(desc(similarityCTE.similarity))
      .offset(offset);

    countQuery = db
      .with(similarityCTE)
      .select({ totalCount: count() })
      .from(similarityCTE)
      .where(
        and(
          eq(similarityCTE.schedulerId, schedulerId),
          eq(similarityCTE.jobListingStatus, JobListingStatusEnum.VALID),
          gt(similarityCTE.similarity, 0.5)
        )
      );
  } else {
    query = db
      .select()
      .from(jobTable)
      .where(
        and(
          eq(jobTable.schedulerId, schedulerId),
          eq(jobTable.jobListingStatus, JobListingStatusEnum.VALID)
        )
      )
      .orderBy(desc(jobTable.jobListedAt))
      .offset(offset);

    countQuery = db
      .select({
        totalCount: count()
      })
      .from(jobTable)
      .where(
        and(
          eq(jobTable.schedulerId, schedulerId),
          eq(jobTable.jobListingStatus, JobListingStatusEnum.VALID)
        )
      );
  }

  const data = await (pageSize ? query.limit(pageSize) : query);
  const total = (await countQuery)[0].totalCount;

  return {
    data,
    pagination: pagination && {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      totalPage: Math.ceil(total / pagination.pageSize)
    }
  };
};

export const getFavouriteJobs = async (
  schedulerId: string,
  pagination?: {
    page: number;
    pageSize: number;
  }
) => {
  const offset = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
  const pageSize = pagination?.pageSize || null;

  const query = db
    .select()
    .from(jobTable)
    .where(
      and(eq(jobTable.schedulerId, schedulerId), eq(jobTable.isFavourite, true))
    )
    .orderBy(desc(jobTable.createdAt))
    .offset(offset);

  const countQuery = db
    .select({ totalCount: count() })
    .from(jobTable)
    .where(
      and(eq(jobTable.schedulerId, schedulerId), eq(jobTable.isFavourite, true))
    );

  const data = await (pageSize ? query.limit(pageSize) : query);
  const total = (await countQuery)[0].totalCount;

  return {
    data,
    pagination: pagination && {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      totalPage: Math.ceil(total / pagination.pageSize)
    }
  };
};

export const updateJobFavourite = async (
  jobId: string,
  isFavourite: boolean
) => {
  const [data] = await db
    .update(jobTable)
    .set({ isFavourite: isFavourite })
    .where(eq(jobTable.id, jobId))
    .returning();

  return data;
};
