import { NextFunction, Response } from "express";
import { INotificationInteractor } from "../../application/interfaces/notification/INotificationInteractor";
import { IRequestWithUser } from "../../application/types/types";

export class NotificaionController {
  private interactor: INotificationInteractor;

  constructor(interactor: INotificationInteractor) {
    this.interactor = interactor;
  }

  async onAddNotification(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const { userId } = req.params;

      const { message, chatId } = req.body;

      const notificaion = await this.interactor.addNotification(
        userId.toString(),
        id.toString(),
        chatId,
        message
      );

      return res.status(200).json({
        success: true,
        message: "notificattion added successfully",
        notificaion,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async onGetNotification(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;
      const notifications = await this.interactor.getNotification(id);

      return res.status(200).json({
        success: true,
        message: "notificattion get successfully",
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async onReadNotification(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sender } = req.params;

      const notification = await this.interactor.updateNotification(sender);

      return res.status(200).json({
        success: true,
        message: "notification updated successfully",
        notification,
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async onEditNotification(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const notification = await this.interactor.updateNotification(id);

      return res.status(200).json({
        success: true,
        message: "notification updated successfully",
        notification,
      });
    } catch (error) {
      next(error);
    }
  }
}
