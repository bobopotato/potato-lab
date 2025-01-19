import "dotenv/config";
import { CookieOptions } from "express";

export const baseConfig = {
  isProduction: process.env.NODE_ENV === "production",
  isStaging: process.env.NODE_ENV === "staging",

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",

  databaseUrl: process.env.DATABASE_URL ?? "",

  baseAwsLambdaUrl: process.env.BASE_AWS_LAMBDA_URL ?? "",

  awsJobScrapperAnalyzeQueueName:
    process.env.AWS_SQS_JOB_SCRAPPER_ANALYZE_QUEUE_NAME ?? "",
  awsJobScrapperProcessQueueName:
    process.env.AWS_SQS_JOB_SCRAPPER_PROCESS_QUEUE_NAME ?? "",

  awsRegion: process.env.AWS_SG_REGION ?? "",

  awsScrapperLambdaArn: process.env.AWS_SCRAPPER_LAMBDA_ARN ?? "",
  awsScrapperLambdaName: process.env.AWS_SCRAPPER_LAMBDA_NAME ?? "",
  awsRuleArn: process.env.AWS_RULE_ARN ?? ""
};

export enum TokenExpiration {
  AccessToken = 5 * 60,
  RefreshToken = 7 * 24 * 60 * 60
}

export const refreshTokenHttpOnlyCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: baseConfig.isProduction || baseConfig.isStaging,
  sameSite: baseConfig.isProduction || baseConfig.isStaging ? "none" : "lax",
  maxAge: TokenExpiration.RefreshToken * 1000
};
