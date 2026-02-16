import type { Document, Model } from "mongoose";

export type UserDocument = Document & {
  email: string;
  password: string;
  name: string;
  verifyPassword: (val: string) => boolean;
};

// Account Types
export interface IAccount {
  user: ObjectId | Document;
  name: string;
  status: "ACTIVE" | "FROZEN" | "CLOSED";
  currency: string;
  systemUser?: boolean;
}

export interface IAccountMethods {
  getBalance(): Promise<number>;
}

export type AccountDocument = Document & IAccount & IAccountMethods;

// Transaction Types

export interface ITransaction {
  idempotencyKey: string;
  fromAccount: ObjectId;
  toAccount: ObjectId;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}
