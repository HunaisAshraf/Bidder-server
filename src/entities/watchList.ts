import { ObjectId } from "mongoose";

export class WatchList {
  constructor(
    public user: string | ObjectId,
    public auction: string | ObjectId
  ) {}
}
