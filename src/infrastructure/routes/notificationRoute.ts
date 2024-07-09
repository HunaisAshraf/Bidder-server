import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { NotificaionController } from "../../adapters/controllers/notificationController";
import { NotificationInteractor } from "../../application/usecases/notifications/notificationInteractor";
import { NotificationRepository } from "../../adapters/repositories/notificationRepository";
const router = express.Router();

const repository = new NotificationRepository();
const interactor = new NotificationInteractor(repository);
const controller = new NotificaionController(interactor);

router.get(
  "/get-notification",
  isAuthenticated,
  controller.onGetNotification.bind(controller)
);
router.put(
  "/read-message/:sender",
  isAuthenticated,
  controller.onReadNotification.bind(controller)
);
router.post(
  "/add-notificaion/:userId",
  isAuthenticated,
  controller.onAddNotification.bind(controller)
);
router.put("/edit-notificaion/:id", isAuthenticated);

export { router as notificationRoute };
