import { ErrorResponse } from "../../../utils/errors";
import { IPaymentInteractor } from "../../interfaces/service/IPaymentInterface";
import { IPaymentRepository } from "../../interfaces/service/IPaymentRepository";
import { StipeIneractor } from "./StripeInteractor";

export class PaymentInteractor implements IPaymentInteractor {
  private stripeInteractor;
  private repository: IPaymentRepository;
  constructor(repository: IPaymentRepository) {
    this.stripeInteractor = new StipeIneractor();
    this.repository = repository;
  }
  async getWallet(id: string): Promise<any> {
    try {
      const wallet = await this.repository.get(id);

      if (!wallet) {
        throw new ErrorResponse("No data in wallet", 404);
      }

      return wallet;
    } catch (error: any) {
      console.log(error);

      throw new ErrorResponse(error.message, error.status);
    }
  }

  async createPaymentIntent(amount: number): Promise<string> {
    try {
      console.log(amount);

      const clientSecret = await this.stripeInteractor.createPaymentIntent(
        amount
      );
      return clientSecret;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async retrievePaymentIntent(paymentIntent: string, id: string): Promise<any> {
    try {
      console.log("retrieve payment interactor");

      const paymentData = await this.stripeInteractor.retreivePaymentIntent(
        paymentIntent
      );
      if (paymentData.status !== "succeeded") {
        throw new ErrorResponse("error in payment");
      }

      let amount = paymentData.amount / 100;
      const data = await this.repository.get(id);

      const transcationDetails = {
        amount,
        action: "added to wallet",
        time: new Date(),
      };

      if (data) {
        amount += data.balance;
      }

      const updatedData = await this.repository.add(
        id,
        amount,
        transcationDetails
      );

      if (!updatedData) {
        throw new ErrorResponse("error in payment", 500);
      }

      return transcationDetails;
    } catch (error: any) {
      console.log("error in payment payment interactor", error);

      throw new ErrorResponse(error.message, error.status);
    }
  }
}
