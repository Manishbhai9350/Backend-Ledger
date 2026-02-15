import type { NextFunction, Request, Response } from "express";
import { DecodeToken } from "../utils/jwt.js";
import UserModal from "../models/user/model.js";
import { AppError } from "./error.middleware.js";

export const AuthMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["auth_token"] || null;

    if (!token) {
      throw new Error("Please Login first!");
    }

    const decoded = DecodeToken(token);

    if (!decoded) {
      throw new Error("Please Login first!");
    }

    const user = await UserModal.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error("Please Login first!");
    }

    req.user = user;

    next();
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};
