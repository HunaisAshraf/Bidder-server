import { ObjectId } from "mongoose";

export class Bid {
  constructor(
    public userId: ObjectId | string,
    public auctionId: ObjectId | string,
    public bidAmount: number,
    public bidTime: Date,
    public isCancelled: boolean
  ) {}
}
