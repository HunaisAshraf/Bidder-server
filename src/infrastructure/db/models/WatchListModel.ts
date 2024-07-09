import mongoose, { Schema, model } from "mongoose";
import { WatchList } from "../../../entities/watchList";

const watchListSchema = new Schema<WatchList>({
  auction: {
    type: Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const WatchListModel = model("WatchList", watchListSchema);
