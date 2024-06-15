export interface IPaymentInteractor {
  createPaymentIntent(amount: number): Promise<string>;
  retrievePaymentIntent(paymentIntent: string, id: string): Promise<any>;
  getWallet(id: string): Promise<any>;
}
