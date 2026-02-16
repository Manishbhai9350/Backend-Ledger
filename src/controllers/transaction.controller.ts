import type { Request, Response } from "express";
import { AccountModel } from "../models/accounts/model.js";
import { TransactionModel } from "../models/transaction/model.js";
import mongoose, { type Document } from "mongoose";
import { LedgerModel } from "../models/ledger/model.js";
import { sendTransactionEmail } from "../services/gmail.service.js";
import { AppError } from "../middlewares/error.middleware.js";
import type { AccountDocument } from "../types/index.js";

interface BodyProps {
  fromAccount: string;
  toAccount: string;
  amount: number;
  idempotencyKey: string;
}

export const CreateTransactionController = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const {
      amount,
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      idempotencyKey,
    } = req.body as BodyProps;

    if (!amount || !fromAccountId || !toAccountId || !idempotencyKey) {
      throw new Error("Provided full data");
    }

    if (!req?.user) {
      throw new Error("Please Login First!");
    }
    const account = await AccountModel.findOne({
      user: req.user._id,
    });

    if (!account) {
      throw new Error("Associated Account Not Found!");
    }

    const fromAccount = (await AccountModel.findOne({
      _id: fromAccountId,
    }).populate("user")) as AccountDocument;
    const toAccount = (await AccountModel.findOne({
      _id: toAccountId,
    })) as AccountDocument;

    if (!fromAccount || !toAccount) {
      throw new Error("Invalid Data");
    }

    if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
      throw new Error("Account is not Active");
    }

    const FromAccountBalance = await fromAccount.getBalance();

    if (FromAccountBalance < amount) {
      throw new Error("Insifficient Balance");
    }

    const ExistingTransaction = await TransactionModel.findOne({
      idempotencyKey,
    });

    if (ExistingTransaction) {
      const status = ExistingTransaction.status;

      if (status == "PENDING") {
        return res.status(200).json({
          message: "Processing Payment.",
          transaction: ExistingTransaction,
        });
      }

      if (status == "COMPLETED") {
        return res.status(200).json({
          message: "Payment Succeeded.",
          transaction: ExistingTransaction,
        });
      }

      if (status == "FAILED") {
        return res.status(200).json({
          message: "Payment Failed.",
          transaction: ExistingTransaction,
        });
      }
      if (status == "REVERSED") {
        return res.status(200).json({
          message: "Payment Refunded.",
          transaction: ExistingTransaction,
        });
      }
    }

    const session = await mongoose.startSession();
    const createdTransaction = await session.withTransaction(async () => {
      const [transaction] = await TransactionModel.create(
        [
          {
            idempotencyKey,
            fromAccount: fromAccountId,
            toAccount: toAccountId,
            amount, // number
            status: "PENDING",
          },
        ],
        { session },
      );

      if (!transaction) throw new Error("Transaction creation failed");

      await LedgerModel.create(
        [
          {
            type: "DEBIT",
            transaction: transaction._id,
            account: fromAccount._id,
            amount,
          },
        ],
        { session },
      );

      await LedgerModel.create(
        [
          {
            type: "CREDIT",
            transaction: transaction._id,
            account: toAccount._id,
            amount,
          },
        ],
        { session },
      );

      transaction.status = "COMPLETED";
      await transaction.save({ session });
      return transaction;
    });

    await sendTransactionEmail({
      to: fromAccount.user.email,
      name: fromAccount.user.name,
      amount,
      toAccount: String(toAccount._id),
    });

    return res.status(200).json({
      message: "Transaction Successfull",
      transaction: createdTransaction,
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
export const CreateInitialFundTransactionController = async (
  req: Request & { user?: Document },
  res: Response,
  next: Function,
) => {
  try {
    const {
      amount,
      toAccount: toAccountId,
      idempotencyKey,
    } = req.body as BodyProps;

    if (!amount || !toAccountId || !idempotencyKey) {
      throw new Error("Provided full data");
    }

    if (!req?.user) {
      throw new Error("Please Login First!");
    }

    const SystemAccount = (await AccountModel.findOne({
      systemUser: true,
      user: req.user._id,
    }).select('+systemUser').populate("user")) as AccountDocument;
    const toAccount = (await AccountModel.findOne({
      _id: toAccountId,
    })) as AccountDocument;

    console.log(SystemAccount)
    console.log(toAccount)

    if (!SystemAccount || !toAccount) {
      throw new Error("Invalid Data");
    }

    if (
      SystemAccount.status !== "ACTIVE" ||
      toAccount.status !== "ACTIVE" ||
      !SystemAccount.systemUser
    ) {
      throw new Error("Account is not Active");
    }

    const ExistingTransaction = await TransactionModel.findOne({
      idempotencyKey,
    });

    if (ExistingTransaction) {
      const status = ExistingTransaction.status;

      if (status == "PENDING") {
        return res.status(200).json({
          message: "Processing Payment.",
          transaction: ExistingTransaction,
        });
      }

      if (status == "COMPLETED") {
        return res.status(200).json({
          message: "Payment Succeeded.",
          transaction: ExistingTransaction,
        });
      }

      if (status == "FAILED") {
        return res.status(200).json({
          message: "Payment Failed.",
          transaction: ExistingTransaction,
        });
      }
      if (status == "REVERSED") {
        return res.status(200).json({
          message: "Payment Refunded.",
          transaction: ExistingTransaction,
        });
      }
    }

    const session = await mongoose.startSession();
    const createdTransaction = await session.withTransaction(async () => {
      const [transaction] = await TransactionModel.create(
        [
          {
            idempotencyKey,
            fromAccount: SystemAccount._id,
            toAccount: toAccountId,
            amount, // number
            status: "PENDING",
          },
        ],
        { session },
      );

      if (!transaction) throw new Error("Transaction creation failed");

      await LedgerModel.create(
        [
          {
            type: "DEBIT",
            transaction: transaction._id,
            account: SystemAccount._id,
            amount,
          },
        ],
        { session },
      );

      await LedgerModel.create(
        [
          {
            type: "CREDIT",
            transaction: transaction._id,
            account: toAccountId,
            amount,
          },
        ],
        { session },
      );

      transaction.status = "COMPLETED";
      await transaction.save({ session });
      return transaction;
    });

    return res.status(200).json({
      message: "Transaction Successfull",
      transaction: createdTransaction,
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
