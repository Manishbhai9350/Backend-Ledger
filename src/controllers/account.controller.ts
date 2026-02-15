import type { Request, Response } from "express";
import { AccountModel } from "../models/accounts/model.js";
import type { Document } from "mongoose";
import { AppError } from "../middlewares/error.middleware.js";
import type { AccountDocument } from "../types/index.js";

export const CreateAccountController = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const { name } = req.body;
    const user = req?.user;

    if (!user) {
      throw new Error("Please Login First");
    }

    const CreatedAccount = await AccountModel.create({
      name,
      user: user._id,
      status: "ACTIVE",
    });

    return res.status(201).json({
      account: CreatedAccount,
      success: true,
    });
  } catch (error: any) {
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};

export const GetUserAccountsController = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const user = req?.user;

    if (!user) {
      throw new Error("Please Login First");
    }

    const accounts = (await AccountModel.find({
      user: user._id,
    })) as AccountDocument[];

    return res.status(200).json({
      accounts,
      success: true,
    });
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};
export const GetUserAccountController = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const accountId = req.params.account;
    const user = req?.user;

    if (!accountId) {
      throw new Error("Invalid Data");
    }
    if (!user) {
      throw new Error("Please Login First");
    }

    const account = (await AccountModel.findOne({
      _id: accountId,
      user: user._id,
    })) as AccountDocument[];

    return res.status(200).json({
      account,
      success: true,
    });
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};

export const GetAccountBalance = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const accountId = req.params.account;
    const user = req.user;

    if (!user || !accountId) {
      throw new Error("Invalid Data");
    }

    const account = (await AccountModel.findOne({
      user: user._id,
      _id: accountId,
    })) as AccountDocument;

    if (!account) {
      throw new Error("Invalid Data");
    }

    const balance = await account.getBalance();

    return res.status(200).json({
      balance,
      id: accountId,
      success: true,
    });
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};
