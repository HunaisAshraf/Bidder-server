import Stripe from "stripe";
import dotenv from "dotenv";
import { ErrorResponse } from "../../../utils/errors";
import { config } from "../../../infrastructure/config/config";
dotenv.config();

const stripe = new Stripe(config.STRIPE_API_KEY as string);

export class StipeIneractor {
  async createPaymentIntent(amount: number): Promise<any> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
      });

      const { client_secret } = paymentIntent;

      return client_secret;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
  async retreivePaymentIntent(paymentIntent: string): Promise<any> {
    try {
      const data = await stripe.paymentIntents.retrieve(paymentIntent);
      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
