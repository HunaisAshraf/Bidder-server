import { ObjectId } from "mongoose";
import { Auction } from "../../../entities/auction";
import { IAuctionInteractor } from "../../interfaces/auction/IAuctionInteractor";
import { IAuctionRepository } from "../../interfaces/auction/IAuctionRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { Bid } from "../../../entities/bid";
import { io } from "../../..";
import { IPaymentRepository } from "../../interfaces/service/IPaymentRepository";
import { AuctionWinner } from "../../../entities/auctionWinner";
import { User } from "../../../entities/User";

export class AuctionInteractor implements IAuctionInteractor {
  private repository: IAuctionRepository;
  private userRepository: IUserRepository;
  private paymentRepository: IPaymentRepository;
  constructor(
    repository: IAuctionRepository,
    userRepository: IUserRepository,
    paymentRepository: IPaymentRepository
  ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
  }

  async getAuction(id: string): Promise<Auction[]> {
    try {
      const data = await this.repository.findByAuctionerId(id);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllAuctions(): Promise<Auction[]> {
    try {
      const data = await this.repository.find();
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getSingleAuctoin(id: string): Promise<Auction | null> {
    try {
      const auction = await this.repository.findOne(id);
      return auction;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addAuction(id: string, auction: Auction): Promise<Auction> {
    try {
      auction.auctioner = id;
      auction.currentBid = auction.basePrice;
      console.log(auction);

      const data = await this.repository.add(auction);

      return data;
    } catch (error: any) {
      console.log("error in add auction interactor", error);
      throw new Error(error.message);
    }
  }

  async editAuction(id: string, value: Auction): Promise<Auction> {
    try {
      const auction = await this.repository.edit(id, value);
      return auction;
    } catch (error: any) {
      console.log("error in editing auction", error);

      throw new Error(error.message);
    }
  }

  async changeAuctionStatus(id: string, status: string): Promise<Auction> {
    try {
      const auction = await this.repository.findOne(id);

      if (auction.isListed) {
        auction.isListed = false;
      } else {
        auction.isListed = true;
      }

      const updatetdAuction = await this.repository.edit(id, auction);

      return updatetdAuction;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async placeBid(
    bidAmount: number,
    auctionId: string,
    userId: string
  ): Promise<Bid> {
    try {
      const auction = await this.repository.findOne(auctionId);
      const wallet = await this.paymentRepository.get(userId);
      const user = await this.userRepository.findOne(userId);

      console.log(wallet);

      if (auction.startDate > new Date()) {
        throw new Error("Auction has not started yet");
      }

      if (auction.endDate < new Date()) {
        throw new Error("Auction has ended");
      }

      if (!user || user?.role === "auctioner" || auction.auctioner === userId) {
        throw new Error("Auctioner cannot bid");
      }

      if (auction.currentBid >= bidAmount) {
        throw new Error("Bid amount must be greater than current bid");
      }

      if (
        !wallet ||
        wallet?.balance < bidAmount ||
        wallet.amountUsed + bidAmount > wallet.balance
      ) {
        throw new Error("No sufficient balance in wallet");
      }

      let amountUsed = bidAmount + wallet.amountUsed;

      await this.paymentRepository.edit(
        user?._id.toString(),
        { amountUsed },
        {}
      );

      const bid: Bid = {
        auctionId,
        userId,
        bidAmount,
        bidTime: new Date(),
        isCancelled: false,
      };

      const newBid = await this.repository.addBid(bid);
      // newBid.userId = user

      auction.currentBid = bidAmount;
      const updatedAuction = await this.repository.edit(
        auction._id.toString(),
        auction
      );

      const bidUser = {
        auctionId: newBid.auctionId,
        bidAmount: newBid.bidAmount,
        bidTime: newBid.bidTime,
        isCancelled: newBid.isCancelled,
        userId: {
          name: user?.name,
        },
      };

      io.emit("updatedAuction", updatedAuction);
      io.emit("newBid", bidUser);

      return newBid;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBids(id: string): Promise<Bid[]> {
    try {
      const bids = await this.repository.getBid(id);
      return bids;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async completedAuction(): Promise<Auction[]> {
    try {
      console.log("completed auction function");

      const completedAuction = await this.repository.getCompletedAuction();

      return completedAuction;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async completeAuction(auction: Auction): Promise<void> {
    try {
      const bids = await this.repository.getBid(auction._id.toString());

      console.log("available bids", bids);

      if (bids.length === 0) {
        throw new Error("no bids available");
      }

      let highestBidder;

      for (let bid of bids) {
        if (!bid.isCancelled) {
          highestBidder = bid;
          break;
        }
      }

      for(let bid of bids){
        await this.paymentRepository.edit(bid.userId._id,{amountUsed:0},{})
      }

      console.log("highest bidder", highestBidder);

      if (!highestBidder) {
        throw new Error("no bids available");
      }

      const auctionWinner: AuctionWinner = {
        user: highestBidder?.userId,
        auctionItem: highestBidder?.auctionId,
        auctioner: auction?.auctioner,
        bidAmount: highestBidder?.bidAmount,
      };
      console.log("auction", auctionWinner);

      const winner = await this.repository.addWinner(auctionWinner);

      const wallet = await this.paymentRepository.get(
        highestBidder.userId._id.toString()
      );
      console.log("wallett", wallet);

      const bidderPaymentUpdate = await this.paymentRepository.edit(
        highestBidder.userId._id.toString(),
        {
          balance: wallet.balance - highestBidder.bidAmount,
          amountUsed: 0,
        },
        {
          amount: highestBidder.bidAmount,
          time: new Date(),
          action: `$ ${highestBidder.bidAmount} was paid for the auction ${auction.itemName}`,
        }
      );

      console.log("bidder payment update", bidderPaymentUpdate);

      const auctionerWallet = await this.paymentRepository.get(
        auction.auctioner.toString()
      );

      // const transcationDetails = {
      //   amount,
      //   action: "added to wallet",
      //   time: new Date(),
      // };

      let auctionerBalance = 0;
      if (auctionerWallet) {
        auctionerBalance = auctionerWallet.balance;
      }

      const auctionerPaymentUpdate = await this.paymentRepository.add(
        auction.auctioner.toString(),
        auctionerBalance + auction.currentBid,
        {
          amount: highestBidder.bidAmount,
          time: new Date(),
          action: `$ ${highestBidder.bidAmount} was added from the auction ${auction.itemName}`,
        }
      );

      console.log("auctioner payment updated", auctionerPaymentUpdate);

      auction.completed = true;
      auction.currentBid = 0;

      const completedAuction = await this.repository.edit(
        auction._id.toString(),
        auction
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getBiddingHistory(id: string): Promise<Bid[]> {
    try {
      const bids = await this.repository.getUserBid(id);
      return bids;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getWonAuction(id: string): Promise<AuctionWinner[]> {
    try {
      const auctions = await this.repository.getAuctionWon(id);
      return auctions;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
