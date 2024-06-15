import { Auction } from "../../../entities/auction";
import { AuctionWinner } from "../../../entities/auctionWinner";
import { Bid } from "../../../entities/bid";

export interface IAuctionInteractor {
  getAuction(id: string): Promise<Auction[]>;
  getAllAuctions(): Promise<Auction[]>;
  getSingleAuctoin(id: string): Promise<Auction | null>;
  addAuction(id: string, auction: Auction): Promise<Auction>;
  editAuction(id: string, value: Auction): Promise<Auction>;
  changeAuctionStatus(id: string, status: string): Promise<Auction>;
  placeBid(bidAmount: number, auctionId: string, userId: string): Promise<Bid>;
  getBids(id: string): Promise<Bid[]>;
  completedAuction(): Promise<Auction[]>;
  completeAuction(auction: Auction): Promise<void>;
  getBiddingHistory(id: string): Promise<Bid[]>;
  getWonAuction(id: string): Promise<AuctionWinner[]>;
}
