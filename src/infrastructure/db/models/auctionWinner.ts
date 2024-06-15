import mongoose, { Schema, model } from "mongoose";
import { AuctionWinner } from "../../../entities/auctionWinner";

const auctionWinnerSchema = new Schema<AuctionWinner>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    auctionItem: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    auctioner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const AuctionWinnerModel = model<AuctionWinner>(
  "AuctionWinner",
  auctionWinnerSchema
);
