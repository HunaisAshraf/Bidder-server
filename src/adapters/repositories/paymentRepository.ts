import { IPaymentRepository } from "../../application/interfaces/service/IPaymentRepository";
import { WalletModel } from "../../infrastructure/db/models/walletModel";
import { ErrorResponse } from "../../utils/errors";

export class PaymentRepository implements IPaymentRepository {
  async add(id: string, amount: number, details: any): Promise<any> {
    try {
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

      if (!walletData) {
        throw new ErrorResponse("error in adding payment");
      }
      return walletData;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async get(id: string): Promise<any> {
    try {
      const data = await WalletModel.findOne({ user: id });

      return data;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  async edit(id: string, amount: any, details: any): Promise<any> {
    try {
      const walletData = await WalletModel.updateOne(
        { user: id },
        {
          $set: amount,
          $push: {
            transcation: details,
          },
        },
        { upsert: true }
      );

      if (!walletData) {
        throw new ErrorResponse("cannot update amount used");
      }

      return walletData;
    } catch (error: any) {
      throw new ErrorResponse(error.message, error.status);
    }
  }
}
