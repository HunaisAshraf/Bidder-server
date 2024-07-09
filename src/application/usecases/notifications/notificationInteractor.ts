import { Notification } from "../../../entities/notification";
import { ErrorResponse } from "../../../utils/errors";
import { INotificationRepository } from "../../interfaces/notification/INotifcationRepository";
import { INotificationInteractor } from "../../interfaces/notification/INotificationInteractor";

export class NotificationInteractor implements INotificationInteractor {
  private repository: INotificationRepository;
  constructor(repository: INotificationRepository) {
    this.repository = repository;
  }

  async addNotification(
    user: string,
    sender: string,
    chatId: string,
    message: string
  ): Promise<Notification> {
    try {
      const notificaion = await this.repository.add(
        user,
        sender,
        chatId,
        message
      );
      return notificaion;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async getNotification(user: string): Promise<Notification[]> {
    try {
      const notificaion = await this.repository.get(user);
      return notificaion;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async updateNotification(sender: string): Promise<any> {
    try {
      const notificaion = await this.repository.edit(sender);
      return notificaion;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
