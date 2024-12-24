import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

interface CustomResponseContent<T = unknown> {
  success?: boolean;
  message?: string;
  code?: string;
  data?: T;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      ok<T>(content?: CustomResponseContent<T>): void;
      badRequest<T>(content?: CustomResponseContent<T>): void;
      unauthorized<T>(content?: CustomResponseContent<T>): void;
      internalServerError<T>(content?: CustomResponseContent<T>): void;
    }
  }
}

const customResponse = (req: Request, res: Response, next: NextFunction) => {
  res.ok = (content) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Success", ...content });
  };

  res.badRequest = (content) => {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Bad Request", ...content });
  };

  res.unauthorized = (content) => {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized", ...content });
  };

  res.internalServerError = (content) => {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error", ...content });
  };

  next();
};

export default customResponse;
