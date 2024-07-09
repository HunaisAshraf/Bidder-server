import { Notification } from "../../../entities/notification";

export interface INotificationInteractor {
  addNotification(
    user: string,
    sender: string,
    chatId: string,
    message: string
  ): Promise<Notification>;
  getNotification(user: string): Promise<Notification[]>;
  updateNotification(sender: string): Promise<any>;
}
