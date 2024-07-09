import { ObjectId } from "mongoose";

export class Notification {
  constructor(
    public _id: string | ObjectId,
    public user: string | ObjectId,
    public sender: string | ObjectId,
    public chatId: string | ObjectId,
    public message: string,
    public read: boolean
  ) {}
}
