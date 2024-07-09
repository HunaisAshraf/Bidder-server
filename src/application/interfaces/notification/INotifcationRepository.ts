import { Notification } from "../../../entities/notification";

export interface INotificationRepository {
  add(
    user: string,
    sender: string,
    chatId: string,
    message: string
  ): Promise<Notification>;
  get(user: string): Promise<Notification[]>;
  edit(sender: string): Promise<any>;
}
