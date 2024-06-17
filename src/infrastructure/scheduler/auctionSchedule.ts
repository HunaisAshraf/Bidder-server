import cron from "node-cron";
import { AuctionInteractor } from "../../application/usecases/auctoins/auctionInteractor";
import { AuctionRepositry } from "../../adapters/repositories/auctionRepository";
import { UserRepository } from "../../adapters/repositories/userRepository";
import { PaymentRepository } from "../../adapters/repositories/paymentRepository";

const auctionRepository = new AuctionRepositry();
const userRepository = new UserRepository();
const paymentRepository = new PaymentRepository();

const auctionInteractor = new AuctionInteractor(
  auctionRepository,
  userRepository,
  paymentRepository
);

cron.schedule("30 5 * * *", async () => {
  try {
    const auctions = await auctionInteractor.completedAuction();

    if (auctions.length === 0) {
      throw new Error("no completed bids available");
    }

    for (let auction of auctions) {
      console.log("single auction");

      await auctionInteractor.completeAuction(auction);
    }
  } catch (error: any) {
    console.log(error.message);
  }
});
