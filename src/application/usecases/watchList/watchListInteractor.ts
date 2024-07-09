import { WatchList } from "../../../entities/watchList";
import { ErrorResponse } from "../../../utils/errors";
import { IWatchListInteractor } from "../../interfaces/watchList/IWatchListInteractor";
import { IWatchListRepository } from "../../interfaces/watchList/IWatchListRepository";

export class WatchListInteractor implements IWatchListInteractor {
  private repository: IWatchListRepository;
  constructor(repository: IWatchListRepository) {
    this.repository = repository;
  }

  async getList(id: string): Promise<WatchList[]> {
    try {
      const watchList = await this.repository.get(id);
      return watchList;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async addToList(auctionId: string, userId: string): Promise<WatchList> {
    try {
      const watchListExist = await this.repository.search(auctionId, userId);
      if (watchListExist) {
        throw new ErrorResponse("auction already exist in watchlist");
      }

      const watchList = await this.repository.add(auctionId, userId);
      return watchList;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async removeFromList(id: string): Promise<void> {
    try {
      const watchList = await this.repository.delete(id);
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async checkList(auction: string, user: string): Promise<WatchList> {
    try {
      const exist = await this.repository.search(auction, user);
      if (!exist) {
        throw new ErrorResponse("not in watch list", 404);
      }
      return exist;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
