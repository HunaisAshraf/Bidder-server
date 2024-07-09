import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { WatchListController } from "../../adapters/controllers/watchListController";
import { WatchListInteractor } from "../../application/usecases/watchList/watchListInteractor";
import { WatchRepository } from "../../adapters/repositories/watchListRepository";

const router = express.Router();

const repository = new WatchRepository();

const interactor = new WatchListInteractor(repository);

const controller = new WatchListController(interactor);

router.get(
  "/get-watchlist",
  isAuthenticated,
  controller.onGetListInteractor.bind(controller)
);
router.get(
  "/check-watchlist/:auctionId",
  isAuthenticated,
  controller.onCheckWatchList.bind(controller)
);
router.post(
  "/add-watchlist/:auctionId",
  isAuthenticated,
  controller.onAddToList.bind(controller)
);
router.delete(
  "/delete-watchlist/:auctionId",
  isAuthenticated,
  controller.onRemoveFromList.bind(controller)
);

export { router as watchListRoute };
