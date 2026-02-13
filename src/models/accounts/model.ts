import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: 'Statis can only be ACTIVE, FROZEN or CLOSED'
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

AccountSchema.index({ user:1,status:1 })

export const AccountModel = mongoose.model('Account',AccountSchema)
