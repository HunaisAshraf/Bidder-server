import { Message } from "../../../entities/message";

export interface IChatInteractor {
  getChat(userId: string): Promise<any[]>;
  addChat(firstUser: string, secondUser: string): Promise<any>;
  getMessage(chatId: string): Promise<Message[]>;
  createMessage(
    chatId: string,
    sender: string,
    message: string,
    image: string
  ): Promise<Message>;
}
