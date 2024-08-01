import { Auction } from "../../../entities/auction";
import { IAuctionInteractor } from "../../interfaces/auction/IAuctionInteractor";
import { IAuctionRepository } from "../../interfaces/auction/IAuctionRepository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { Bid } from "../../../entities/bid";
import { io } from "../../..";
import { IPaymentRepository } from "../../interfaces/service/IPaymentRepository";
import { AuctionWinner } from "../../../entities/auctionWinner";
import { User } from "../../../entities/User";
import { ErrorResponse } from "../../../utils/errors";
import { IMailerService } from "../../interfaces/service/IMailerService";
import { IWatchListRepository } from "../../interfaces/watchList/IWatchListRepository";

export class AuctionInteractor implements IAuctionInteractor {
  private repository: IAuctionRepository;
  private userRepository: IUserRepository;
  private paymentRepository: IPaymentRepository;
  private mailService: IMailerService;
  private watchListRepository: IWatchListRepository;
  constructor(
    repository: IAuctionRepository,
    userRepository: IUserRepository,
    paymentRepository: IPaymentRepository,
    mailService: IMailerService,
    watchListRepository: IWatchListRepository
  ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
    this.mailService = mailService;
    this.watchListRepository = watchListRepository;
  }

  async adminGetAllAuctions(): Promise<Auction[]> {
    try {
      const data = await this.repository.findAll();
      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getAuction(id: string): Promise<Auction[]> {
    try {
      const data = await this.repository.findByAuctionerId(id);
      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getAllAuctions(): Promise<Auction[]> {
    try {
      const data = await this.repository.find();
      const filteredAuctions = data.filter(
        (auction: any) => auction.auctioner.isActive
      );

      return filteredAuctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getSingleAuctoin(id: string): Promise<Auction | null> {
    try {
      const auction = await this.repository.findOne(id);
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async addAuction(id: string, auction: Auction): Promise<Auction> {
    try {
      auction.auctioner = id;
      auction.currentBid = auction.basePrice;

      const data = await this.repository.add(auction);

      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async editAuction(
    userId: string,
    auctionId: string,
    value: Auction
  ): Promise<Auction> {
    try {
      const auction = await this.repository.findOne(auctionId);

      if (auction.auctioner.toString() !== userId) {
        throw new ErrorResponse("user not authorised");
      }

      const editedAuction = await this.repository.edit(auctionId, value);
      return editedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async changeAuctionStatus(
    userId: string,
    auctionId: string,
    status: string
  ): Promise<Auction> {
    try {
      const auction = await this.repository.findOne(auctionId);

      if (auction.auctioner.toString() !== userId) {
        throw new ErrorResponse("user not authorised", 401);
      }

      if (auction.isListed) {
        auction.isListed = false;
      } else {
        auction.isListed = true;
      }

      const updatetdAuction = await this.repository.edit(auctionId, auction);

      return updatetdAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
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

      if (auction.startDate > new Date()) {
        throw new ErrorResponse("Auction has not started yet", 400);
      }

      if (auction.endDate < new Date()) {
        throw new ErrorResponse("Auction has ended", 400);
      }

      if (!user || user?.role === "auctioner" || auction.auctioner === userId) {
        throw new ErrorResponse("Auctioner cannot bid", 400);
      }

      if (auction.currentBid >= bidAmount) {
        throw new ErrorResponse(
          "Bid amount must be greater than current bid",
          400
        );
      }

      if (
        !wallet ||
        wallet?.balance < bidAmount ||
        wallet.amountUsed + bidAmount > wallet.balance
      ) {
        throw new ErrorResponse("No sufficient balance in wallet", 400);
      }

      const allBids = await this.repository.getBid(auctionId);

      console.log(allBids);

      const lastBidderWallet = await this.paymentRepository.get(
        allBids[0].userId
      );

      await this.paymentRepository.edit(
        lastBidderWallet.user,
        {
          amountUsed: lastBidderWallet.amountUsed - allBids[0].bidAmount,
        },
        []
      );

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
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getBids(id: string): Promise<Bid[]> {
    try {
      const bids = await this.repository.getBid(id);
      return bids;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async completedAuction(): Promise<Auction[]> {
    try {
      const completedAuction = await this.repository.getCompletedAuction();

      return completedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async completeAuction(auction: Auction): Promise<void> {
    try {
      const bids = await this.repository.getBid(auction._id.toString());

      if (bids.length === 0) {
        auction.completed = true;
        await this.repository.edit(auction._id.toString(), auction);
        throw new ErrorResponse("no bids available", 400);
      }

      let highestBidder;

      for (let bid of bids) {
        if (!bid.isCancelled) {
          highestBidder = bid;
          break;
        }
      }

      for (let bid of bids) {
        await this.paymentRepository.edit(
          bid.userId._id,
          { amountUsed: 0 },
          {}
        );
      }

      if (!highestBidder) {
        throw new ErrorResponse("no bids available");
      }

      const auctionWinner: AuctionWinner = {
        user: highestBidder?.userId,
        auctionItem: highestBidder?.auctionId,
        auctioner: auction?.auctioner,
        bidAmount: highestBidder?.bidAmount,
      };

      const winner = await this.repository.addWinner(auctionWinner);

      const wallet = await this.paymentRepository.get(
        highestBidder.userId._id.toString()
      );

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

      const auctionerWallet = await this.paymentRepository.get(
        auction.auctioner.toString()
      );

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

      auction.completed = true;
      auction.currentBid = 0;

      const completedAuction = await this.repository.edit(
        auction._id.toString(),
        auction
      );
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async startedAuction(): Promise<Auction[]> {
    try {
      const startedAuction = await this.repository.getStartedAuction();

      return startedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async startAuction(auction: Auction): Promise<void> {
    try {
      auction.started = true;
      const updateAuction = await this.repository.edit(
        auction._id.toString(),
        auction
      );

      const watchList = await this.watchListRepository.findByAuction(
        auction._id.toString()
      );

      if (watchList.length === 0) {
        throw new ErrorResponse("no one in watchlist", 404);
      }
      for (let list of watchList) {
        await this.mailService.auctionStartMail(list.user, auction);
      }
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getBiddingHistory(id: string): Promise<Bid[]> {
    try {
      const bids = await this.repository.getUserBid(id);
      return bids;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getWonAuction(id: string): Promise<AuctionWinner[]> {
    try {
      const auctions = await this.repository.getAuctionWon(id);
      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async verifyAuction(id: string): Promise<Auction> {
    try {
      const auction = await this.repository.verify(id);

      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async filterAuction(filter: any): Promise<Auction[]> {
    try {
      let searchFilter;
      if (filter === "live") {
        searchFilter = {
          completed: false,
        };
      } else if (filter === "completed") {
        searchFilter = { completed: true };
      } else if (filter === "verified") {
        searchFilter = { isVerified: true };
      } else if (filter === "notVerified") {
        searchFilter = { isVerified: false };
      } else {
        searchFilter = {};
      }

      const auctions = await this.repository.filter(searchFilter);
      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getCount(filter: any): Promise<number> {
    try {
      let searchFilter;
      if (filter === "live") {
        searchFilter = {
          completed: false,
        };
      } else if (filter === "completed") {
        searchFilter = { completed: true };
      } else if (filter === "verified") {
        searchFilter = { isVerified: true };
      } else if (filter === "notVerified") {
        searchFilter = { isVerified: false };
      } else {
        searchFilter = {};
      }

      const count = await this.repository.count(searchFilter);
      return count;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async blockAuction(id: string): Promise<Auction> {
    try {
      const auction = await this.repository.findOne(id);
      let status;
      if (auction.isBlocked) {
        status = false;
      } else {
        status = true;
      }

      const updatedAuction = await this.repository.block(id, status);
      return updatedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async searchAuction(search: string): Promise<Auction[]> {
    try {
      const auction = await this.repository.search(search);
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getCompletedAuction(userId: string): Promise<AuctionWinner[]> {
    try {
      const auction = await this.repository.completedAuctionByAuctioner(userId);

      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getAuctionWonByAuction(aucitonId: string): Promise<AuctionWinner> {
    try {
      const auction = await this.repository.getAuctionByauctionId(aucitonId);
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getMonthlyRevenue(): Promise<any> {
    try {
      const revenue = await this.repository.revenue();
      return revenue;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getAuctionDetails(): Promise<any> {
    try {
      const auctions = await this.repository.findAll();

      const count = {
        upcoming: 0,
        live: 0,
        completed: 0,
        all: auctions.length,
      };
      for (let auction of auctions) {
        if (new Date(auction.startDate) > new Date()) {
          count.upcoming++;
        } else if (
          new Date(auction.startDate) < new Date() &&
          new Date(auction.endDate) > new Date()
        ) {
          count.live++;
        } else if (auction.completed) {
          count.completed++;
        }
      }

      return count;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
