import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: [true, "Transaction is required"],
    index: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["CREDIT", "DEBIT"],
    },
    required: [true, "Ledger Type is required: CREDIT or DEBIT"],
    immutable: true,
  },
});


const PreventUpdatingDeletion = () => {
    throw new Error('Ledger Model can not either be Modified or Deleted')
}

LedgerSchema.pre('updateOne',PreventUpdatingDeletion)
LedgerSchema.pre('updateMany',PreventUpdatingDeletion)
LedgerSchema.pre('deleteMany',PreventUpdatingDeletion)
LedgerSchema.pre('deleteOne',PreventUpdatingDeletion)
LedgerSchema.pre('findOneAndDelete',PreventUpdatingDeletion)
LedgerSchema.pre('findOneAndReplace',PreventUpdatingDeletion)
LedgerSchema.pre('findOneAndUpdate',PreventUpdatingDeletion)
LedgerSchema.pre('replaceOne',PreventUpdatingDeletion)


export const LedgerModel = mongoose.model('Ledger',LedgerSchema)