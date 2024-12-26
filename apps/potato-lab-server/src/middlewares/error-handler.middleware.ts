import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error Handler");
  console.log("=============");
  console.error({ message: err.message });
  console.error({ err });
  res.internalServerError({
    message: err.message,
    data: err
  });
  next();
};

export default errorHandler;
