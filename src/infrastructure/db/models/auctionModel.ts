import mongoose, { Schema, model } from "mongoose";
import { Auction } from "../../../entities/auction";

const auctionSchema = new Schema<Auction>({
  itemName: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  auctioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  images: [],
  completed: {
    type: Boolean,
    default: false,
  },
});

export const AuctionModel = model<Auction>("Auction", auctionSchema);
