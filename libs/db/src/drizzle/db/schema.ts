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
  primaryKey
} from "drizzle-orm/pg-core";

export const SourcePlatform = pgEnum("SourcePlatform", [
  "BINANCE",
  "BYBIT",
  "MEDX"
]);

export const userTable = pgTable(
  "User",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 256 }),
    createdAt: timestamp("createdAt").defaultNow()
  },
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("email_idx").on(table.email)
  ]
);

export const userRelations = relations(userTable, ({ many }) => {
  return {
    favouritePortfolio: many(portfolioTable)
  };
});

export const portfolioTable = pgTable("Portfolio", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  profileUrl: varchar("profileUrl", { length: 256 }).notNull(),
  performance: jsonb("performance").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 256 }).notNull(),
  sourcePlatform: SourcePlatform("sourcePlatform").notNull()
});

export const portfolioRelations = relations(portfolioTable, ({ many }) => {
  return {
    favouriteBy: many(userTable)
  };
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
