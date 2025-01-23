CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE "JobCompanyInfoNotExist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "JobCompanyInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"businessName" varchar(256) NOT NULL,
	"openingHours" varchar[],
	"address" varchar(256),
	"locationGeometry" geometry(point) NOT NULL,
	"phoneNumber" varchar(256),
	"mapUrl" varchar(256) NOT NULL,
	"website" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "Job" ADD COLUMN "companyInfoId" uuid;--> statement-breakpoint
ALTER TABLE "Job" ADD COLUMN "companyInfoNotExistId" uuid;--> statement-breakpoint
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyInfoId_JobCompanyInfo_id_fk" FOREIGN KEY ("companyInfoId") REFERENCES "public"."JobCompanyInfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyInfoNotExistId_JobCompanyInfoNotExist_id_fk" FOREIGN KEY ("companyInfoNotExistId") REFERENCES "public"."JobCompanyInfoNotExist"("id") ON DELETE no action ON UPDATE no action;