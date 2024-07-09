import express from "express";
import { AuctionController } from "../../adapters/controllers/auctionController";
import { AuthService } from "../service/authService";
import { AuctionInteractor } from "../../application/usecases/auctoins/auctionInteractor";
import { AuctionRepositry } from "../../adapters/repositories/auctionRepository";
import { UserRepository } from "../../adapters/repositories/userRepository";
import { PaymentRepository } from "../../adapters/repositories/paymentRepository";
import {
  isAdmin,
  isAuctioner,
  isAuthenticated,
} from "../middlewares/isAuthenticated";
import { MailService } from "../service/mailService";
import { WatchRepository } from "../../adapters/repositories/watchListRepository";
const router = express.Router();

const authService = new AuthService();
const repository = new AuctionRepositry();
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();
const mailService = new MailService(userRepository);
const watchListRepository = new WatchRepository();
const interactor = new AuctionInteractor(
  repository,
  userRepository,
  paymentRepository,
  mailService,
  watchListRepository
);

const controller = new AuctionController(authService, interactor);

router.post(
  "/add-auction",
  isAuctioner,
  controller.onAddAuction.bind(controller)
);
router.get("/get-all-auctions", controller.onGetAllAuction.bind(controller));
router.get(
  "/admin-get-auction",
  isAdmin,
  controller.onAdminGetAllAuction.bind(controller)
);
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
  "/edit-auction/:auctionId",
  isAuctioner,
  controller.onEditAuction.bind(controller)
);
router.put(
  "/auction-status/:auctionId",
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
router.get(
  "/auction-won/:auctionId",
  isAuthenticated,
  controller.onGetAuctionWon.bind(controller)
);

router.put(
  "/verify-auction/:id",
  isAdmin,
  controller.onAdminVerifyAuction.bind(controller)
);

router.get(
  "/filter-auction",
  isAdmin,
  controller.onFilterAuction.bind(controller)
);

router.put(
  "/block-auction/:id",
  isAdmin,
  controller.onBlockAuction.bind(controller)
);
router.get(
  "/search-auction",
  isAdmin,
  controller.onSearchAuction.bind(controller)
);
router.get(
  "/completed-auction",
  isAuctioner,
  controller.onGetCompletedAuction.bind(controller)
);
router.get(
  "/dashboard-auction",
  isAdmin,
  controller.onGetAdminDashboard.bind(controller)
);

export { router as auctionRouter };
