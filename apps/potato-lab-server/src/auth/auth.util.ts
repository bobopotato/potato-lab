import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import { User } from "@prisma/client";
import { publicUserDataSchema } from "@potato-lab/shared-types";

export const encryptPassword = async (inputPassword: string) => {
  const result = await hash(inputPassword, 10);
  return result;
};

export const comparePassword = async (
  inputPassword: string,
  hashedPassword: string
) => {
  const result = await compare(hashedPassword, inputPassword);
  return result;
};

export const generateAccessToken = (user: User | unknown) => {
  const userData = publicUserDataSchema.parse(user);
  const accessToken = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "10s"
  });

  return accessToken;
};

export const generateRefreshToken = (user: User) => {
  const userData = publicUserDataSchema.parse(user);
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3m"
  });

  return refreshToken;
};
