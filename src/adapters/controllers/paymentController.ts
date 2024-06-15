import { NextFunction, Request, Response } from "express";
import { IPaymentInteractor } from "../../application/interfaces/service/IPaymentInterface";
import { IAuthService } from "../../application/interfaces/service/IAuthService";

export class PaymentController {
  private interactor: IPaymentInteractor;
  private authService: IAuthService;
  constructor(interactor: IPaymentInteractor, authService: IAuthService) {
    this.interactor = interactor;
    this.authService = authService;
  }

  async onGetWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("user not authorised");
      }
      const { _id } = this.authService.verifyToken(token);
      const data = await this.interactor.getWallet(_id.toString());

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async onCreateIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      console.log(amount);

      const clientSecret = await this.interactor.createPaymentIntent(amount);
      return res.status(200).json({ success: true, clientSecret });
    } catch (error) {
      next(error);
    }
  }

  async onAddToWallet(req: Request, res: Response, next: NextFunction) {
    try {

      console.log("payment controller");
      
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("user not authorised");
      }

      const { _id } = this.authService.verifyToken(token);

      const { paymentIntent } = req.body;

      const data = await this.interactor.retrievePaymentIntent(
        paymentIntent,
        _id.toString()
      );
      console.log("sending response");
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log("error in controller", error);

      next(error);
    }
  }
}
