import { WatchList } from "../../../entities/watchList";

export interface IWatchListRepository {
  get(user: string): Promise<WatchList[]>;
  findByAuction(auciton: string): Promise<WatchList[]>;
  search(auction: string, user: string): Promise<WatchList | null>;
  add(auction: string, user: string): Promise<WatchList>;
  delete(id: string): Promise<void>;
}
