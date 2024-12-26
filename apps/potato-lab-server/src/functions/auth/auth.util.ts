import jwt from "jsonwebtoken";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User } from "@potato-lab/shared-types";
import { publicUserDataSchema } from "@potato-lab/shared-types";
import { baseConfig, TokenExpiration } from "../../configs";

const scryptAsync = promisify(scrypt);

export const _encryptPassword = async (inputPassword: string) => {
  const salt = randomBytes(8).toString("hex");
  const derivedKey = (await scryptAsync(inputPassword, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
};

export const _comparePassword = async (
  inputPassword: string,
  hashedPassword: string
) => {
  const [salt, storedHash] = hashedPassword.split(":");
  const derivedKey = (await scryptAsync(inputPassword, salt, 64)) as Buffer;
  return storedHash === derivedKey.toString("hex");
};

export const encryptPassword = async (inputPassword: string) => {
  const result = await _encryptPassword(inputPassword);
  return result;
};

export const comparePassword = async (
  inputPassword: string,
  hashedPassword: string
) => {
  const result = await _comparePassword(inputPassword, hashedPassword);
  return result;
};

export const generateAccessToken = (user: User | unknown) => {
  const userData = publicUserDataSchema.parse(user);
  const accessToken = jwt.sign(userData, baseConfig.accessTokenSecret, {
    expiresIn: TokenExpiration.AccessToken
  });

  return accessToken;
};

export const generateRefreshToken = (user: User) => {
  const userData = publicUserDataSchema.parse(user);
  const refreshToken = jwt.sign(userData, baseConfig.refreshTokenSecret, {
    expiresIn: TokenExpiration.RefreshToken
  });

  return refreshToken;
};
