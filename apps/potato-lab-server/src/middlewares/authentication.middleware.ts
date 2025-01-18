import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { publicUserDataSchema } from "@potato-lab/shared-types";
import { baseConfig } from "../configs";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers["authorization"] ||
    req.headers["Authorization"]) as string;
  const token = authHeader && authHeader.split(" ")[1];
  console.log({ token });
  if (token == null) return res.unauthorized();

  try {
    const decoded = jwt.verify(token, baseConfig.accessTokenSecret as string);
    const user = publicUserDataSchema.parse(decoded);
    req.user = user;
    next();
  } catch {
    res.unauthorized();
    return;
  }
};

export default authenticateToken;
