import { IAuctionRepository } from "../../application/interfaces/auction/IAuctionRepository";
import { User } from "../../entities/User";
import { Auction } from "../../entities/auction";
import { AuctionWinner } from "../../entities/auctionWinner";
import { Bid } from "../../entities/bid";
import { AuctionModel } from "../../infrastructure/db/models/auctionModel";
import { AuctionWinnerModel } from "../../infrastructure/db/models/auctionWinner";
import { BidModel } from "../../infrastructure/db/models/bidModel";
import { ErrorResponse } from "../../utils/errors";

export class AuctionRepositry implements IAuctionRepository {
  async findAll(): Promise<Auction[]> {
    try {
      const auctions = await AuctionModel.find()
        .sort({ startDate: -1 })
        .populate("auctioner");

      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async add(auction: Auction): Promise<Auction> {
    try {
      const data = new AuctionModel(auction);
      await data.save();
      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async find(): Promise<Auction[]> {
    try {
      const auctions = await AuctionModel.find({
        isListed: true,
        isVerified: true,
        isBlocked: false,
        endDate: { $gte: new Date() },
      }).populate("auctioner");

      if (!auctions) {
        throw new ErrorResponse("no auction found", 404);
      }

      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async findByAuctionerId(id: string): Promise<Auction[]> {
    try {
      const auctions = await AuctionModel.find({ auctioner: id });

      if (!auctions) {
        throw new ErrorResponse("no auction found", 404);
      }

      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Auction> {
    try {
      const auction = await AuctionModel.findById(id);

      if (!auction) {
        throw new ErrorResponse("auction not found", 404);
      }

      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async edit(id: string, value: Auction): Promise<Auction> {
    try {
      const auction = await AuctionModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      if (!auction) {
        throw new ErrorResponse("error in editing auction", 500);
      }

      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async addBid(bid: Bid): Promise<Bid> {
    try {
      const newBid = await BidModel.findOneAndUpdate(
        { auctionId: bid.auctionId, userId: bid.userId },
        bid,
        { new: true, upsert: true }
      );

      if (!newBid) {
        throw new ErrorResponse("Error in adding bid", 500);
      }
      return newBid;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getBid(id: string): Promise<any[]> {
    try {
      const bids = await BidModel.find({ auctionId: id })
        .populate("userId")
        .sort({ bidAmount: -1 });
      return bids;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getCompletedAuction(): Promise<Auction[]> {
    try {
      const completedAuction = await AuctionModel.find({
        completed: false,
        endDate: { $lte: new Date() },
      });

      return completedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getStartedAuction(): Promise<Auction[]> {
    try {
      const startedAuction = await AuctionModel.find({
        started: false,
        startDate: { $lte: new Date() },
      });
      return startedAuction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async addWinner(data: AuctionWinner): Promise<AuctionWinner> {
    try {
      const winner = new AuctionWinnerModel(data);

      await winner.save();
      return winner;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getUserBid(id: string): Promise<Bid[]> {
    try {
      const bids = await BidModel.find({ userId: id }).populate("auctionId");
      return bids;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getAuctionWon(id: string): Promise<AuctionWinner[]> {
    try {
      const auctions = await AuctionWinnerModel.find({ user: id }).populate(
        "auctionItem"
      );
      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async verify(id: string): Promise<Auction> {
    try {
      const auction = await AuctionModel.findByIdAndUpdate(
        id,
        { isVerified: true },
        { new: true }
      );
      if (!auction) {
        throw new ErrorResponse("error in verifying auction", 500);
      }
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async filter(filter: any): Promise<Auction[]> {
    try {
      const auction = await AuctionModel.find(filter).populate("auctioner");

      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async count(filter: any): Promise<number> {
    try {
      const count = await AuctionModel.find({
        filter,
      })
        .populate("auctioner")
        .countDocuments();

      return count;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async block(id: string, status: boolean): Promise<Auction> {
    try {
      const auction = await AuctionModel.findByIdAndUpdate(
        id,
        { isBlocked: status },
        { new: true }
      );
      if (!auction) {
        throw new ErrorResponse("error in blocking/unblocking auction", 500);
      }
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async search(search: string): Promise<Auction[]> {
    try {
      const auctions = await AuctionModel.find({
        itemName: { $regex: search, $options: "i" },
      }).populate("auctioner");
      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async completedAuctionByAuctioner(
    auctioner: string
  ): Promise<AuctionWinner[]> {
    try {
      const auctions = await AuctionWinnerModel.find({ auctioner })
        .populate("auctionItem")
        .populate("user");

      return auctions;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getAuctionByauctionId(auctionId: string): Promise<AuctionWinner> {
    try {
      const auction = await AuctionWinnerModel.findOne({
        auctionItem: auctionId,
      })
        .populate("auctionItem")
        .populate("user");
      if (!auction) {
        throw new ErrorResponse("auciton not found", 404);
      }
      return auction;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async revenue(): Promise<any> {
    try {
      const revenue = await AuctionWinnerModel.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalRevenue: { $sum: "$bidAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalRevenue: 1,
          },
        },
        {
          $sort: { year: 1, month: 1 },
        },
      ]);

      return revenue;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async auction(): Promise<any> {
    // try {
    //   const auctions = await AuctionModel.aggregate([
    //     {
    //       $addFields: {
    //         currentDate: new Date(),
    //       },
    //     },
    //     {
    //       $facet: {
    //         upcoming: [
    //           { $match: { startDate: { $gt: "$currentDate" } } },
    //           { $count: "count" },
    //         ],
    //         live: [
    //           {
    //             $match: {
    //               startDate: { $lte: "$currentDate" },
    //               endDate: { $gte: "$currentDate" },
    //             },
    //           },
    //           { $count: "count" },
    //         ],
    //         completed: [
    //           { $match: { endDate: { $lt: "$currentDate" } } },
    //           { $count: "count" },
    //         ],
    //       },
    //     },
    //   ]);
    //   return auctions;
    // } catch (error: any) {
    //   throw new ErrorResponse(error.message, error.status);
    // }
  }
}
