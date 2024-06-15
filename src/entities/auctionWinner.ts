import { ObjectId } from "mongoose";

export class AuctionWinner {
  constructor(
    public user: string | ObjectId,
    public auctionItem: string | ObjectId,
    public bidAmount: number,
    public auctioner: string | ObjectId
  ) {}
}
