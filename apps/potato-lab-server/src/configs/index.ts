import "dotenv/config";
import { CookieOptions } from "express";

export const baseConfig = {
  isProduction: process.env.NODE_ENV === "production",
  isStaging: process.env.NODE_ENV === "staging",

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsAccessKeySecret: process.env.AWS_SECRET_ACCESS_KEY ?? "",

  databaseUrl: process.env.DATABASE_URL ?? ""
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
