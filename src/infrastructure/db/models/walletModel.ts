import mongoose, { Schema, model } from "mongoose";

const walletSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  amountUsed: {
    type: Number,
    default: 0,
  },
  transcation: [],
});

export const WalletModel = model("Wallet", walletSchema);
