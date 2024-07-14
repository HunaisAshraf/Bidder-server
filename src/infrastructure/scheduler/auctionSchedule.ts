import cron from "node-cron";
import { AuctionInteractor } from "../../application/usecases/auctoins/auctionInteractor";
import { AuctionRepositry } from "../../adapters/repositories/auctionRepository";
import { UserRepository } from "../../adapters/repositories/userRepository";
import { PaymentRepository } from "../../adapters/repositories/paymentRepository";
import { MailService } from "../service/mailService";
import { WatchRepository } from "../../adapters/repositories/watchListRepository";

const repository = new AuctionRepositry();
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();
const mailService = new MailService(userRepository);
const watchListRepository = new WatchRepository();
const auctionInteractor = new AuctionInteractor(
  repository,
  userRepository,
  paymentRepository,
  mailService,
  watchListRepository
);

cron.schedule("*/30 * * * * *", async () => {
  try {
    const auctions = await auctionInteractor.completedAuction();

    if (auctions.length === 0) {
      throw new Error("no completed bids available");
    }

    for (let auction of auctions) {
      await auctionInteractor.completeAuction(auction);
    }
  } catch (error: any) {}
});
cron.schedule("*/30 * * * * *", async () => {
  try {
    const auctions = await auctionInteractor.startedAuction();

    if (auctions.length === 0) {
      throw new Error("no started auction available");
    }

    for (let auction of auctions) {
      await auctionInteractor.startAuction(auction);
    }
  } catch (error: any) {}
});
