import { IPaymentRepository } from "../../application/interfaces/service/IPaymentRepository";
import { WalletModel } from "../../infrastructure/db/models/walletModel";

export class PaymentRepository implements IPaymentRepository {
  async add(id: string, amount: number, details: any): Promise<any> {
    try {
      console.log("adding wallet amount");
      console.log("auctioner details", details);

      const walletData = await WalletModel.updateOne(
        { user: id },
        {
          $set: {
            balance: amount,
          },
          $push: {
            transcation: details,
          },
        },
        {
          upsert: true,
        }
      );

      console.log("updated auctioner wallet", walletData);

      if (!walletData) {
        throw new Error("error in adding payment");
      }
      return walletData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async get(id: string): Promise<any> {
    try {
      console.log("getting data", id);

      const data = await WalletModel.findOne({ user: id });
      console.log(data);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async edit(id: string, amount: any, details: any): Promise<any> {
    try {
      console.log(id, amount);

      const walletData = await WalletModel.updateOne(
        { user: id },
        {
          $set: amount,
          $push: {
            transcation: details,
          },
        },
        {upsert:true}
      );

      if (!walletData) {
        throw new Error("cannot update amount used");
      }

      return walletData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
