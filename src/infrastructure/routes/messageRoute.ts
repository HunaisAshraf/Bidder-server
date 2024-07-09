import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { ChatController } from "../../adapters/controllers/chatController";
import { ChatInteractor } from "../../application/usecases/chats/chatInteractor";
import { ChatRepository } from "../../adapters/repositories/ChatRepository";
const router = express.Router();

const repository = new ChatRepository();

const interactor = new ChatInteractor(repository);

const controller = new ChatController(interactor);

router.get(
  "/get-chat",
  isAuthenticated,
  controller.onGetChats.bind(controller)
);
router.post(
  "/add-chat",
  isAuthenticated,
  controller.onAddChat.bind(controller)
);
router.get(
  "/get-messages/:chatId",
  isAuthenticated,
  controller.ongetMessages.bind(controller)
);
router.post(
  "/add-message/:chatId",
  isAuthenticated,
  controller.onAddMessage.bind(controller)
);

export { router as messageRouter };
