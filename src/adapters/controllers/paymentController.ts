import { NextFunction, Request, Response } from "express";
import { IPaymentInteractor } from "../../application/interfaces/service/IPaymentInterface";
import { IAuthService } from "../../application/interfaces/service/IAuthService";
import { IRequestWithUser } from "../../application/types/types";

export class PaymentController {
  private interactor: IPaymentInteractor;
  private authService: IAuthService;
  constructor(interactor: IPaymentInteractor, authService: IAuthService) {
    this.interactor = interactor;
    this.authService = authService;
  }

  async onGetWallet(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;

      const data = await this.interactor.getWallet(id);

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async onCreateIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;

      const clientSecret = await this.interactor.createPaymentIntent(amount);
      return res.status(200).json({ success: true, clientSecret });
    } catch (error) {
      next(error);
    }
  }

  async onAddToWallet(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const { paymentIntent } = req.body;

      const data = await this.interactor.retrievePaymentIntent(
        paymentIntent,
        id
      );
      console.log("sending response");

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log("error in controller", error);

      next(error);
    }
  }
}
