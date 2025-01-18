CREATE TYPE "public"."CryptoSourcePlatform" AS ENUM('BINANCE', 'BYBIT', 'MEDX');--> statement-breakpoint
CREATE TYPE "public"."JobListingStatus" AS ENUM('VALID', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."JobSourcePlatform" AS ENUM('JOBSTREET', 'INDEED');--> statement-breakpoint
CREATE TYPE "public"."SchedulerFrequency" AS ENUM('HOURLY', 'DAILY', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."SchedulerType" AS ENUM('JOBS_SCRAPPER', 'CRYPTO_SCRAPPER');--> statement-breakpoint
CREATE TYPE "public"."SourcePlatform" AS ENUM('BINANCE', 'BYBIT', 'MEDX', 'JOBSTREET', 'INDEED');--> statement-breakpoint
CREATE TYPE "public"."Status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "Job" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"sourceJobId" varchar(256) NOT NULL,
	"sourceUrl" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"companyName" varchar(256) NOT NULL,
	"companyImageUrl" varchar(256),
	"location" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"position" varchar(256) NOT NULL,
	"detailsTemplate" text NOT NULL,
	"jobListedAt" timestamp NOT NULL,
	"jobListingStatus" "JobListingStatus" DEFAULT 'VALID' NOT NULL,
	"sourcePlatform" "JobSourcePlatform" NOT NULL,
	"isFavourite" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"schedulerId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"profileUrl" varchar(256) NOT NULL,
	"performance" jsonb NOT NULL,
	"sourceUrl" varchar(256) NOT NULL,
	"sourcePlatform" "CryptoSourcePlatform" NOT NULL
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
CREATE TABLE "SchedulerRecord" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record" jsonb NOT NULL,
	"lastTriggerAt" timestamp NOT NULL,
	"lastSuccessAt" timestamp,
	"schedulerId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Scheduler" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256),
	"type" "SchedulerType" NOT NULL,
	"frequency" "SchedulerFrequency" NOT NULL,
	"frequencyExpression" varchar(256) NOT NULL,
	"sourcePlatform" "SourcePlatform"[] NOT NULL,
	"keywords" varchar(256)[],
	"status" "Status" DEFAULT 'ACTIVE',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_favourite_portfolio" (
	"userId" uuid NOT NULL,
	"portfolioId" uuid NOT NULL,
	CONSTRAINT "user_favourite_portfolio_userId_portfolioId_pk" PRIMARY KEY("userId","portfolioId")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"imageUrl" varchar(256),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Job" ADD CONSTRAINT "Job_schedulerId_Scheduler_id_fk" FOREIGN KEY ("schedulerId") REFERENCES "public"."Scheduler"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Position" ADD CONSTRAINT "Position_portfolioId_Portfolio_id_fk" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SchedulerRecord" ADD CONSTRAINT "SchedulerRecord_schedulerId_Scheduler_id_fk" FOREIGN KEY ("schedulerId") REFERENCES "public"."Scheduler"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Scheduler" ADD CONSTRAINT "Scheduler_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" ADD CONSTRAINT "user_favourite_portfolio_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" ADD CONSTRAINT "user_favourite_portfolio_portfolioId_Portfolio_id_fk" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "User" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "User" USING btree ("email");