import { INotificationRepository } from "../../application/interfaces/notification/INotifcationRepository";
import { Notification } from "../../entities/notification";
import { NotificationModel } from "../../infrastructure/db/models/notificationModel";
import { ErrorResponse } from "../../utils/errors";

export class NotificationRepository implements INotificationRepository {
  async add(
    user: string,
    sender: string,
    chatId: string,
    message: string
  ): Promise<Notification> {
    try {
      const notification = new NotificationModel({
        user,
        sender,
        chatId,
        message,
      });
      await notification.save();
      return notification;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async get(user: string): Promise<Notification[]> {
    try {
      const notification = await NotificationModel.find({ user })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("sender");
      return notification;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async edit(sender: string): Promise<any> {
    try {
      const notification = await NotificationModel.updateMany(
        { sender },
        {
          $set: {
            read: true,
          },
        }
      );

      // if (!notification) {
      //   throw new ErrorResponse("error in updating notification", 500);
      // }

      return notification;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
