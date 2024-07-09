import mongoose from "mongoose";
import { IChatRepository } from "../../application/interfaces/chat/IChatRepository";
import { Message } from "../../entities/message";
import { ChatModel } from "../../infrastructure/db/models/chatModel";
import { MessageModel } from "../../infrastructure/db/models/messageModel";
import { ErrorResponse } from "../../utils/errors";

export class ChatRepository implements IChatRepository {
  async getChats(userId: string): Promise<any[]> {
    try {
      const chats = await ChatModel.find({
        users: { $in: [userId] },
      }).populate("users");

      return chats;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async createChat(firstUser: string, secondUser: string): Promise<any> {
    try {
      let user1 = new mongoose.Types.ObjectId(firstUser);
      let user2 = new mongoose.Types.ObjectId(secondUser);

      const chat = new ChatModel({
        users: [user1, user2],
      });
      await chat.save();

      return chat;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getMessage(chatId: string): Promise<Message[]> {
    try {
      const messages = await MessageModel.find({ chatId });
      return messages;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async createMessage(
    chatId: string,
    sender: string,
    message: string,
    image: string
  ): Promise<Message> {
    try {
      const newMessage = new MessageModel({
        chatId,
        sender,
        message,
        image,
      });
      await newMessage.save();
      return newMessage;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async checkChat(firstUser: string, secondUser: string): Promise<any> {
    try {
      const chat = await ChatModel.findOne({
        users: { $all: [firstUser, secondUser] },
      });
      return chat;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
