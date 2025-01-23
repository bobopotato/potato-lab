import {
  jobCompanyInfoTable,
  JobListingStatusEnum,
  jobTable
} from "@potato-lab/db";
import { db } from "../../db";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  or,
  SQL,
  sql
} from "drizzle-orm";
import { WithSubqueryWithSelection } from "drizzle-orm/pg-core";
import {
  Job,
  jobCompanyInfoSchema,
  jobSchema,
  JobWithCompanyInfo,
  jobWithCompanyInfoQuerySchema
} from "@potato-lab/shared-types";
import { z } from "zod";

const _jobTableColumns = getTableColumns(jobTable);

const buildJobQuery = (
  schedulerId: string,
  options: {
    whereStatements?: (
      table:
        | typeof jobTable
        | WithSubqueryWithSelection<
            { similarity: SQL.Aliased<number> } & typeof _jobTableColumns,
            "similarity"
          >
    ) => SQL<unknown>[];
    keyword?: string;
    pagination?: {
      page: number;
      pageSize: number;
    };
  } = {}
) => {
  const offset = options?.pagination
    ? (options?.pagination.page - 1) * options?.pagination.pageSize
    : 0;

  let query;
  let countQuery;
  let table;

  if (options?.keyword?.length) {
    const similarityCTE = db.$with("similarity").as(
      db
        .select({
          ...getTableColumns(jobTable),
          similarity:
            sql<number>`word_similarity(${options.keyword}, "detailsTemplate")`.as(
              "similarity"
            ),
          similarity2:
            sql<number>`word_similarity(${options.keyword}, "companyName")`.as(
              "similarity2"
            ),
          similarity3:
            sql<number>`word_similarity(${options.keyword}, "description")`.as(
              "similarity3"
            )
        })
        .from(jobTable)
    );

    table = similarityCTE;

    const _whereStatements = and(
      eq(similarityCTE.schedulerId, schedulerId),
      or(
        gt(similarityCTE.similarity, 0.6),
        gt(similarityCTE.similarity2, 0.6),
        gt(similarityCTE.similarity3, 0.6)
      ),
      ...(options?.whereStatements
        ? options.whereStatements(similarityCTE)
        : [])
    );

    query = db
      .with(similarityCTE)
      .select()
      .from(similarityCTE)
      .where(_whereStatements)
      .orderBy(
        desc(similarityCTE.similarity2),
        desc(similarityCTE.similarity3),
        desc(similarityCTE.similarity)
      )
      .offset(offset);

    countQuery = db
      .with(similarityCTE)
      .select({ totalCount: count() })
      .from(similarityCTE)
      .where(_whereStatements);
  } else {
    const _whereStatements = and(
      eq(jobTable.schedulerId, schedulerId),
      ...(options?.whereStatements ? options.whereStatements(jobTable) : [])
    );

    table = jobTable;

    query = db
      .select()
      .from(jobTable)
      .where(_whereStatements)
      .orderBy(desc(jobTable.jobListedAt))
      .offset(offset);

    countQuery = db
      .select({
        totalCount: count()
      })
      .from(jobTable)
      .where(_whereStatements);
  }

  return { query, countQuery, table };
};

export const getJobs = async (
  schedulerId: string,
  keyword?: string,
  pagination?: {
    page: number;
    pageSize: number;
  }
) => {
  const pageSize = pagination?.pageSize || null;

  const { query, countQuery } = buildJobQuery(schedulerId, {
    keyword,
    pagination,
    whereStatements: (table) => [
      eq(table.jobListingStatus, JobListingStatusEnum.VALID)
    ]
  });

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
  const pageSize = pagination?.pageSize || null;

  const { query, countQuery } = buildJobQuery(schedulerId, {
    pagination,
    whereStatements: (table) => [eq(table.isFavourite, true)]
  });

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

export const getJobsWithCompanyInfo = async (
  schedulerId: string,
  keyword?: string
) => {
  const { query, table } = buildJobQuery(schedulerId, {
    keyword,
    whereStatements: (table) => [
      eq(table.jobListingStatus, JobListingStatusEnum.VALID)
    ]
  });

  const schema = z
    .union([
      z.object({ Job: jobSchema, JobCompanyInfo: jobCompanyInfoSchema }),
      z
        .object({
          similarity: jobSchema,
          JobCompanyInfo: jobCompanyInfoSchema
        })
        .transform((d) => ({
          Job: d.similarity,
          JobCompanyInfo: d.JobCompanyInfo
        }))
    ])
    .array();

  const _data = await query.rightJoin(
    jobCompanyInfoTable,
    eq(table.companyInfoId, jobCompanyInfoTable.id)
  );
  console.log(_data[0]);

  const data = schema.parse(_data);

  const result = data.reduce(
    (acc, { Job, JobCompanyInfo }) => {
      const existingJobCompanyInfo = acc.find(
        (d) => d.id === JobCompanyInfo.id
      );
      if (existingJobCompanyInfo) {
        existingJobCompanyInfo.jobs.push(Job);
        return acc;
      }

      acc.push({
        ...JobCompanyInfo,
        jobs: [Job]
      });
      return acc;
    },
    [] as z.infer<typeof jobWithCompanyInfoQuerySchema>
  );

  return result;
};
