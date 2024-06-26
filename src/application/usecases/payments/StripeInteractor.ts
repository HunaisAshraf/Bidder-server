import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export class StipeIneractor {
  async createPaymentIntent(amount: number): Promise<any> {
    try {
      console.log("aaa", amount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
      });

      const { client_secret } = paymentIntent;

      return client_secret;
    } catch (error: any) {
      console.log(error);

      throw new Error(error.message);
    }
  }
  async retreivePaymentIntent(paymentIntent: string): Promise<any> {
    try {
      console.log("retrieving payment intent");

      const data = await stripe.paymentIntents.retrieve(paymentIntent);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
