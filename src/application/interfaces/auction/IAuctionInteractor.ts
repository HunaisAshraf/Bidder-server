import { Auction } from "../../../entities/auction";
import { AuctionWinner } from "../../../entities/auctionWinner";
import { Bid } from "../../../entities/bid";

export interface IAuctionInteractor {
  getAuction(id: string): Promise<Auction[]>;
  getAllAuctions(): Promise<Auction[]>;
  adminGetAllAuctions(): Promise<Auction[]>;
  getSingleAuctoin(id: string): Promise<Auction | null>;
  addAuction(id: string, auction: Auction): Promise<Auction>;
  editAuction(
    userId: string,
    auction_id: string,
    value: Auction
  ): Promise<Auction>;
  changeAuctionStatus(
    userId: string,
    auctionId: string,
    status: string
  ): Promise<Auction>;
  placeBid(bidAmount: number, auctionId: string, userId: string): Promise<Bid>;
  getBids(id: string): Promise<Bid[]>;
  startedAuction(): Promise<Auction[]>;
  startAuction(auction: Auction): Promise<void>;
  completedAuction(): Promise<Auction[]>;
  completeAuction(auction: Auction): Promise<void>;
  getBiddingHistory(id: string): Promise<Bid[]>;
  getWonAuction(id: string): Promise<AuctionWinner[]>;
  verifyAuction(id: string): Promise<Auction>;
  filterAuction(filter: any): Promise<Auction[]>;
  getCount(filter: any): Promise<number>;
  blockAuction(id: string): Promise<Auction>;
  searchAuction(search: string): Promise<Auction[]>;
  getCompletedAuction(userId: string): Promise<AuctionWinner[]>;
  getAuctionWonByAuction(aucitonId: string): Promise<AuctionWinner>;
  getMonthlyRevenue(): Promise<any>;
  getAuctionDetails(): Promise<any>;
}
