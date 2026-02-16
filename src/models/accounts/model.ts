import mongoose, { Model } from "mongoose";
import { LedgerModel } from "../ledger/model.js";
import type {
  AccountDocument,
  IAccount,
  IAccountMethods,
} from "../../types/index.js";

const AccountSchema = new mongoose.Schema<
  IAccount,
  Model<IAccount, {}, IAccountMethods>,
  IAccountMethods
>(
  {
    name: {
      type: String,
      required: [true, "Account Name Is Required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Statis can only be ACTIVE, FROZEN or CLOSED",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      default: "INR",
    },
    systemUser: {
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
    }
  },
  {
    timestamps: true,
  },
);

AccountSchema.index({ user: 1, status: 1 });

AccountSchema.methods.getBalance = async function (
  this: AccountDocument,
): Promise<number> {
  const balance = await LedgerModel.aggregate([
    {
      $match: { account: this._id },
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] },
      },
    },
  ]);

  if (balance.length == 0) {
    return 0;
  }

  return balance[0].balance;
};

export const AccountModel = mongoose.model("Account", AccountSchema);
