import express from "express";
import { AuctionController } from "../../adapters/controllers/auctionController";
import { AuthService } from "../service/authService";
import { AuctionInteractor } from "../../application/usecases/auctoins/auctionInteractor";
import { AuctionRepositry } from "../../adapters/repositories/auctionRepository";
import { UserRepository } from "../../adapters/repositories/userRepository";
import { PaymentRepository } from "../../adapters/repositories/paymentRepository";
import { isAuctioner, isAuthenticated } from "../middlewares/isAuthenticated";
const router = express.Router();

const authService = new AuthService();
const repository = new AuctionRepositry();
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();
const interactor = new AuctionInteractor(
  repository,
  userRepository,
  paymentRepository
);

const controller = new AuctionController(authService, interactor);

router.post(
  "/add-auction",
  isAuctioner,
  controller.onAddAuction.bind(controller)
);
router.get("/get-all-auctions", controller.onGetAllAuction.bind(controller));
router.get(
  "/get-auctions",
  isAuctioner,
  controller.onGetAuction.bind(controller)
);
router.get(
  "/get-single-auction/:id",
  controller.onGetOneAuction.bind(controller)
);
router.put(
  "/edit-auction/:id",
  isAuctioner,
  controller.onEditAuction.bind(controller)
);
router.put(
  "/auction-status/:id",
  isAuctioner,
  controller.onAuctionStatus.bind(controller)
);
router.post(
  "/place-bid",
  isAuthenticated,
  controller.onPlaceBid.bind(controller)
);
router.get("/get-bids/:id", controller.onGetBids.bind(controller));
router.get(
  "/bidding-history",
  isAuthenticated,
  controller.onGetBiddingHistory.bind(controller)
);
router.get(
  "/auction-won",
  isAuthenticated,
  controller.onAuctionWon.bind(controller)
);

export { router as auctionRouter };
