import type { NextFunction, Request, Response } from "express";
import {
  CreateResourceError,
  InvalidCredentialsError,
  ResourceExistsError,
  ResourceNotFoundError,
} from "./error";

interface ErrorPayload {
  error: string;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ErrorPayload>,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  let status = 500;
  let message = "Internal server error";

  if (error instanceof ResourceExistsError) {
    status = 409;
    message = error.message;
  } else if (error instanceof ResourceNotFoundError) {
    status = 404;
    message = error.message;
  } else if (error instanceof InvalidCredentialsError) {
    status = 401;
    message = error.message;
  } else if (error instanceof CreateResourceError) {
    status = 500;
    message = error.message;
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  res.status(status).json({ error: message });
}

