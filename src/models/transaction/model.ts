import mongoose from "mongoose";
import type { ITransaction } from "../../types/index.js";

const TransactionSchema = new mongoose.Schema<ITransaction>({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "From Account is required while creating transaction"],
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "To Account is required while creating transaction"],
  },
  status: {
    type: String,
    enum: {
      values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
    },
    default: "PENDING",
  },
  amount: {
    type: Number,
    required: [true,'Amount is required']
  },
  idempotencyKey: {
    type: String,
    required: [true, "Idempotency Key is required"],
    unique: true,
    index: true,
  },
},{
    timestamps:true
});

export const TransactionModel = mongoose.model(
  "Transaction",
  TransactionSchema,
);
