import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../utils/errors";

export const errorHandler = (
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(error.status || 500)
    .send({ success: false, error: error.message });
};
