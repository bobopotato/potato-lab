CREATE TYPE "public"."SourcePlatform" AS ENUM('BINANCE', 'BYBIT', 'MEDX');--> statement-breakpoint
CREATE TABLE "UserFavouritePortfolio" (
	"userId" uuid NOT NULL,
	"portfolioId" uuid NOT NULL,
	CONSTRAINT "UserFavouritePortfolio_userId_portfolioId_pk" PRIMARY KEY("userId","portfolioId")
);
--> statement-breakpoint
CREATE TABLE "Portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"profileUrl" varchar(256) NOT NULL,
	"performance" jsonb NOT NULL,
	"sourceUrl" varchar(256) NOT NULL,
	"sourcePlatform" "SourcePlatform" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar(256) NOT NULL,
	"size" numeric NOT NULL,
	"entryPrice" numeric NOT NULL,
	"margin" numeric NOT NULL,
	"portfolioId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"imageUrl" varchar(256),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "UserFavouritePortfolio" ADD CONSTRAINT "UserFavouritePortfolio_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserFavouritePortfolio" ADD CONSTRAINT "UserFavouritePortfolio_portfolioId_Portfolio_id_fk" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Position" ADD CONSTRAINT "Position_portfolioId_Portfolio_id_fk" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "User" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "User" USING btree ("email");