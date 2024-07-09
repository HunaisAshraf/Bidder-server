import { IWatchListRepository } from "../../application/interfaces/watchList/IWatchListRepository";
import { WatchList } from "../../entities/watchList";
import { WatchListModel } from "../../infrastructure/db/models/WatchListModel";
import { ErrorResponse } from "../../utils/errors";

export class WatchRepository implements IWatchListRepository {
  async get(user: string): Promise<WatchList[]> {
    try {
      const watchList = await WatchListModel.find({ user }).populate("auction");
      return watchList;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async findByAuction(auction: string): Promise<WatchList[]> {
    try {
      const watchList = await WatchListModel.find({ auction }).populate("user");
      return watchList;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async add(auction: string, user: string): Promise<WatchList> {
    try {
      const watchList = new WatchListModel({
        auction,
        user,
      });
      await watchList.save();
      return watchList;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await WatchListModel.findByIdAndDelete(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async search(auction: string, user: string): Promise<WatchList | null> {
    try {
      const wathclist = await WatchListModel.findOne({ auction, user });
      return wathclist;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
