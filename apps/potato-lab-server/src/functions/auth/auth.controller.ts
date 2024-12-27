import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import { createUser, getUserByEmail } from "./auth.service";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken
} from "./auth.util";
import {
  signInReqSchema,
  signUpReqSchema,
  publicUserDataSchema
} from "@potato-lab/shared-types";
import { baseConfig, refreshTokenHttpOnlyCookieOptions } from "../../configs";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = signUpReqSchema.parse({
    ...req.body,
    image: req.file
  });

  await createUser(email, password, name, req.file?.buffer, req.file?.mimetype);
  res.ok({
    message: "User created successfully"
  });
};

export const signIn = async (req: Request, res: Response) => {
  console.log(`halo here`);
  console.log({
    test: process.env
  });
  const { email, password } = signInReqSchema.parse(req.body);
  const user = await getUserByEmail(email);

  if (!user) {
    return res.badRequest({
      message: "Invalid user or password!"
    });
  }

  const passwordMatched = comparePassword(password, user.password);

  if (!passwordMatched) {
    return res.badRequest({
      message: "Invalid user or password!"
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, refreshTokenHttpOnlyCookieOptions);

  return res.ok({
    data: {
      accessToken,
      userData: publicUserDataSchema.parse(user)
    }
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.unauthorized();
  }

  try {
    const decoded = jwt.verify(refreshToken, baseConfig.refreshTokenSecret);

    const accessToken = generateAccessToken(decoded);
    return res.ok({ data: accessToken });
  } catch (err) {
    console.dir({ err });
    return res.unauthorized();
  }
};

export const setCookie = (req: Request, res: Response) => {
  // Our `token` cookie will be parsed into `req.cookies.token`
  console.log("🍪", JSON.stringify(req.cookies));

  const token = "abcd.123456.xyz44"; // dummy JWT token
  res.cookie("token", token, refreshTokenHttpOnlyCookieOptions);
  res.ok();
};
