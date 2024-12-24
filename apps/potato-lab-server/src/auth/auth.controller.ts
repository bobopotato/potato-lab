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

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = signUpReqSchema.parse({
    ...req.body,
    image: req.file
  });

  await createUser(email, password, name, req.file.buffer, req.file.mimetype);
  res.ok({
    message: "User created successfully"
  });
};

export const signIn = async (req: Request, res: Response) => {
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

  // generate JWT and return
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax", //"none",
    secure: false, //true,
    domain: "localhost",
    maxAge: 24 * 60 * 60 * 1000
  });

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

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error, data: unknown) => {
      if (err) {
        console.log(`hereeeeee`);
        console.dir({ err });
        return res.unauthorized();
      }
      console.log({ data });
      const accessToken = generateAccessToken(data);
      return res.ok({ data: accessToken });
    }
  );
};

export const setCookie = (req: Request, res: Response) => {
  // Our `token` cookie will be parsed into `req.cookies.token`
  console.log("🍪", req.cookies);

  const token = "abcd.123456.xyz44"; // dummy JWT token
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.cookie("token", token, {
    maxAge: 1000 * 60 * 15, // expire after 15 minutes
    httpOnly: true, // Cookie will not be exposed to client side code
    sameSite: "none", // If client and server origins are different
    secure: true // use with HTTPS only
  });
  res.ok();
};
