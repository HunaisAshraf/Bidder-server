import { Schema, model } from "mongoose";
import { Message } from "../../../entities/message";

const messageModel = new Schema<Message>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const MessageModel = model("Message", messageModel);
