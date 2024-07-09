import { Message } from "../../../entities/message";

export interface IChatRepository {
  getChats(user_id: string): Promise<any[]>;
  checkChat(firstUser: string, secondUser: string): Promise<any>;
  createChat(firstUser: string, secondUser: string): Promise<any>;
  getMessage(chatId: string): Promise<Message[]>;
  createMessage(
    chatId: string,
    sender: string,
    message: string,
    image: string
  ): Promise<Message>;
}
