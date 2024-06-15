import mongoose, { Schema, model } from "mongoose";
import { Bid } from "../../../entities/bid";

const bidSchema = new Schema<Bid>({
  auctionId: {
    type: Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  bidTime: {
    type: Date,
    required: true,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
});

export const BidModel = model("Bid", bidSchema);
