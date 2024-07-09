import { Message } from "../../../entities/message";
import { ErrorResponse } from "../../../utils/errors";
import { IChatInteractor } from "../../interfaces/chat/IChatInteractor";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";

export class ChatInteractor implements IChatInteractor {
  private repository: IChatRepository;
  constructor(repository: IChatRepository) {
    this.repository = repository;
  }
  async getChat(userId: string): Promise<any[]> {
    try {
      const chat = await this.repository.getChats(userId);

      return chat;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async addChat(firstUser: string, secondUser: string): Promise<any> {
    try {
      const chatExist = await this.repository.checkChat(firstUser, secondUser);

      if (chatExist) {
        return chatExist;
      }
      const chat = await this.repository.createChat(firstUser, secondUser);

      return chat;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async getMessage(chatId: string): Promise<Message[]> {
    try {
      const message = await this.repository.getMessage(chatId);
      return message;
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
      const newMessage = await this.repository.createMessage(
        chatId,
        sender,
        message,
        image
      );
      return newMessage;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
