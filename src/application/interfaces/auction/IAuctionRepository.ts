import { Auction } from "../../../entities/auction";
import { AuctionWinner } from "../../../entities/auctionWinner";
import { Bid } from "../../../entities/bid";

export interface IAuctionRepository {
  add(auction: Auction): Promise<Auction>;
  find(): Promise<Auction[]>;
  findByAuctionerId(id: string): Promise<Auction[]>;
  findOne(id: string): Promise<Auction>;
  edit(id: string, value: Auction): Promise<Auction>;
  addBid(bid: Bid): Promise<Bid>;
  getBid(id: string): Promise<any[]>;
  getCompletedAuction(): Promise<Auction[]>;
  addWinner(data: AuctionWinner): Promise<AuctionWinner>;
  getUserBid(id: string): Promise<Bid[]>;
  getAuctionWon(id: string): Promise<AuctionWinner[]>;
}
