import { WatchList } from "../../../entities/watchList";

export interface IWatchListInteractor {
  getList(id: string): Promise<WatchList[]>;
  addToList(auction: string, user: string): Promise<WatchList>;
  removeFromList(id: string): Promise<void>;
  checkList(auction: string, user: string): Promise<WatchList>;
}
