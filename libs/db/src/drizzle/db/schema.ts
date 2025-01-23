import { relations } from "drizzle-orm";
import {
  numeric,
  uuid,
  timestamp,
  pgTable,
  varchar,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
  text,
  boolean,
  geometry
} from "drizzle-orm/pg-core";

const enumToPgEnum = <T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] => {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
};

interface _SchedulerRecord {
  [key: string]: {
    totalCount: number;
    currentCount: number;
    failedCount: number;
  };
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum CryptoSourcePlatformEnum {
  BINANCE = "BINANCE",
  BYBIT = "BYBIT",
  MEDX = "MEDX"
}

export enum JobSourcePlatformEnum {
  JOBSTREET = "JOBSTREET",
  INDEED = "INDEED"
}

export const SourcePlatformType = {
  ...CryptoSourcePlatformEnum,
  ...JobSourcePlatformEnum
};

export enum SchedulerTypeEnum {
  JOBS_SCRAPPER = "JOBS_SCRAPPER",
  CRYPTO_SCRAPPER = "CRYPTO_SCRAPPER"
}

export enum SchedulerFrequencyEnum {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  CUSTOM = "CUSTOM"
}

export enum JobListingStatusEnum {
  VALID = "VALID",
  EXPIRED = "EXPIRED"
}

export const Status = pgEnum("Status", enumToPgEnum(StatusEnum));

export const CryptoSourcePlatform = pgEnum(
  "CryptoSourcePlatform",
  enumToPgEnum(CryptoSourcePlatformEnum)
);

export const JobSourcePlatform = pgEnum(
  "JobSourcePlatform",
  enumToPgEnum(JobSourcePlatformEnum)
);

export const SourcePlatform = pgEnum(
  "SourcePlatform",
  enumToPgEnum(SourcePlatformType)
);

export const SchedulerType = pgEnum(
  "SchedulerType",
  enumToPgEnum(SchedulerTypeEnum)
);

export const SchedulerFrequency = pgEnum(
  "SchedulerFrequency",
  enumToPgEnum(SchedulerFrequencyEnum)
);

export const JobListingStatus = pgEnum(
  "JobListingStatus",
  enumToPgEnum(JobListingStatusEnum)
);

export const userTable = pgTable(
  "User",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 256 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("email_idx").on(table.email)
  ]
);

export const portfolioTable = pgTable("Portfolio", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  profileUrl: varchar("profileUrl", { length: 256 }).notNull(),
  performance: jsonb("performance").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 256 }).notNull(),
  sourcePlatform: CryptoSourcePlatform("sourcePlatform").notNull()
});

export const positionTable = pgTable("Position", {
  id: uuid("id").primaryKey().defaultRandom(),
  symbol: varchar({ length: 256 }).notNull(),
  size: numeric().notNull(),
  entryPrice: numeric().notNull(),
  margin: numeric().notNull(),
  portfolioId: uuid("portfolioId")
    .references(() => portfolioTable.id)
    .notNull()
});

export const userFavouritePortfolioTable = pgTable(
  "user_favourite_portfolio",
  {
    userId: uuid("userId")
      .references(() => userTable.id)
      .notNull(),
    portfolioId: uuid("portfolioId")
      .references(() => portfolioTable.id)
      .notNull()
  },
  (table) => [primaryKey({ columns: [table.userId, table.portfolioId] })]
);

export const schedulerTable = pgTable("Scheduler", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  type: SchedulerType("type").notNull(),
  frequency: SchedulerFrequency("frequency").notNull(),
  frequencyExpression: varchar("frequencyExpression", {
    length: 256
  }).notNull(),
  sourcePlatform: SourcePlatform("sourcePlatform").array().notNull(),
  keywords: varchar("keywords", { length: 256 }).array(),
  status: Status("status").default(StatusEnum.ACTIVE),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: uuid("userId")
    .references(() => userTable.id)
    .notNull()
});

export const schedulerRecordTable = pgTable("SchedulerRecord", {
  id: uuid("id").primaryKey().defaultRandom(),
  record: jsonb("record").$type<_SchedulerRecord>().notNull(),
  lastTriggerAt: timestamp("lastTriggerAt").notNull(),
  lastSuccessAt: timestamp("lastSuccessAt"),
  schedulerId: uuid("schedulerId")
    .references(() => schedulerTable.id)
    .notNull()
});

// create a scheduler to clean up old data (1 week old data)
// if next scrape found same sourceJobId -> override it / skip it
// set outdated status for those job not found in next scrape
export const jobTable = pgTable(
  "Job",
  {
    // combine {table.schedulerId-table.sourceJobId}
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    sourceJobId: varchar("sourceJobId", { length: 256 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    companyName: varchar("companyName", { length: 256 }).notNull(),
    companyImageUrl: varchar("companyImageUrl", { length: 256 }),
    location: varchar("location", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    position: varchar("position", { length: 256 }).notNull(),
    detailsTemplate: text("detailsTemplate").notNull(),
    jobListedAt: timestamp("jobListedAt").notNull(),
    jobListingStatus: JobListingStatus("jobListingStatus")
      .notNull()
      .default(JobListingStatusEnum.VALID),
    sourcePlatform: JobSourcePlatform("sourcePlatform").notNull(),
    isFavourite: boolean("isFavourite").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    schedulerId: uuid("schedulerId")
      .references(() => schedulerTable.id)
      .notNull(),
    companyInfoId: uuid("companyInfoId").references(
      () => jobCompanyInfoTable.id
    ),
    companyInfoNotExistId: uuid("companyInfoNotExistId").references(
      () => jobCompanyInfoNotExistTable.id
    )
  },
  (table) => [
    index("detailsTemplate_gin_idx").using(
      "gin",
      table.detailsTemplate.op("gin_trgm_ops")
    )
  ]
);

export const jobCompanyInfoTable = pgTable("JobCompanyInfo", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  businessName: varchar("businessName", { length: 256 }).notNull(),
  openingHours: varchar("openingHours").array(), // day opening hours text
  address: varchar("address", { length: 256 }),
  locationGeometry: geometry("locationGeometry").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 256 }),
  mapUrl: varchar("mapUrl", { length: 256 }).notNull(),
  website: varchar("website", { length: 256 })
});

export const jobCompanyInfoNotExistTable = pgTable("JobCompanyInfoNotExist", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull()
});

export const jobRelations = relations(jobTable, ({ one }) => {
  return {
    scheduler: one(schedulerTable, {
      fields: [jobTable.schedulerId],
      references: [schedulerTable.id]
    }),
    companyInfo: one(jobCompanyInfoTable, {
      fields: [jobTable.companyInfoId],
      references: [jobCompanyInfoTable.id]
    }),
    companyInfoNotExist: one(jobCompanyInfoNotExistTable, {
      fields: [jobTable.companyInfoNotExistId],
      references: [jobCompanyInfoNotExistTable.id]
    })
  };
});

export const jobCompanyInfoRelations = relations(
  jobCompanyInfoTable,
  ({ many }) => {
    return {
      jobs: many(jobTable)
    };
  }
);

export const jobCompanyInfoNotExistRelations = relations(
  jobCompanyInfoNotExistTable,
  ({ many }) => {
    return {
      jobs: many(jobTable)
    };
  }
);

export const userRelations = relations(userTable, ({ many }) => {
  return {
    favouritePortfolio: many(portfolioTable),
    scheduler: many(schedulerTable)
  };
});

export const schedulerRelations = relations(schedulerTable, ({ one, many }) => {
  return {
    user: one(userTable, {
      fields: [schedulerTable.userId],
      references: [userTable.id]
    }),
    jobs: many(jobTable),
    record: many(schedulerRecordTable)
  };
});

export const schedulerRecordRelations = relations(
  schedulerRecordTable,
  ({ one }) => {
    return {
      belongToScheduler: one(schedulerTable, {
        fields: [schedulerRecordTable.id],
        references: [schedulerTable.id]
      })
    };
  }
);

export const portfolioRelations = relations(portfolioTable, ({ many }) => {
  return {
    favouriteBy: many(userTable)
  };
});

export const userFavouritePortfolioRelations = relations(
  userFavouritePortfolioTable,
  ({ one }) => {
    return {
      user: one(userTable, {
        fields: [userFavouritePortfolioTable.userId],
        references: [userTable.id]
      }),
      portfolio: one(portfolioTable, {
        fields: [userFavouritePortfolioTable.portfolioId],
        references: [portfolioTable.id]
      })
    };
  }
);
