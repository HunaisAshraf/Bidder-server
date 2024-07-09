import { ObjectId } from "mongoose";

export class Auction {
  constructor(
    public _id: ObjectId | string,
    public itemName: string,
    public basePrice: number,
    public currentBid: number,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public auctioner: ObjectId | string,
    public isListed: boolean,
    public isVerified: boolean,
    public isBlocked: boolean,
    public images: string[],
    public completed: boolean,
    public started: boolean
  ) {}
}
