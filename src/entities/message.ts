import { ObjectId } from "mongoose";

export class Message {
  constructor(
    public _id: ObjectId | string,
    public chatId: ObjectId | string,
    public message: string,
    public sender: ObjectId | string,
    public image: string
  ) {}
}
