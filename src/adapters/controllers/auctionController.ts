import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../application/interfaces/service/IAuthService";
import { IAuctionInteractor } from "../../application/interfaces/auction/IAuctionInteractor";
import { IRequestWithUser } from "../../application/types/types";

export class AuctionController {
  private authService: IAuthService;
  private interactor: IAuctionInteractor;

  constructor(authService: IAuthService, interactor: IAuctionInteractor) {
    this.authService = authService;
    this.interactor = interactor;
  }

  async onGetAllAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const auctions = await this.interactor.getAllAuctions();
      return res.status(200).json({ success: true, auctions });
    } catch (error) {
      next(error);
    }
  }

  async onAdminGetAllAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const auctions = await this.interactor.adminGetAllAuctions();
      return res.status(200).json({ success: true, auctions });
    } catch (error) {
      next(error);
    }
  }

  async onGetAuction(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id, role } = req.user!;

      const auctions = await this.interactor.getAuction(id);
      return res.status(200).json({ success: true, auctions });
    } catch (error) {
      next(error);
    }
  }

  async onAddAuction(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      const body = req.body;

      const auction = await this.interactor.addAuction(id, body);

      return res.status(200).json({
        success: true,
        message: "aucton added successfully",
        auction,
      });
    } catch (error) {
      next(error);
    }
  }

  async onGetOneAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const auction = await this.interactor.getSingleAuctoin(id);

      return res.status(200).json({ success: true, auction });
    } catch (error) {
      next(error);
    }
  }

  async onEditAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const { auctionId } = req.params;
      const body = req.body;

      const auction = await this.interactor.editAuction(id, auctionId, body);

      return res.status(200).json({
        success: true,
        message: "auction edited successfully",
        auction,
      });
    } catch (error) {
      next(error);
    }
  }

  async onAuctionStatus(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const { auctionId } = req.params;

      const { status } = req.body;

      const auction = await this.interactor.changeAuctionStatus(
        id,
        auctionId,
        status
      );

      return res.status(200).json({
        success: true,
        message: "auction edited successfully",
        auction,
      });
    } catch (error) {
      next(error);
    }
  }

  async onPlaceBid(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;

      const { bidAmount, auctionId } = req.body;

      const bid = await this.interactor.placeBid(bidAmount, auctionId, id);

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async onGetBids(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const bids = await this.interactor.getBids(id);

      return res.status(200).json({ success: true, bids });
    } catch (error) {
      next(error);
    }
  }

  async onGetBiddingHistory(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const biddingHistory = await this.interactor.getBiddingHistory(id);

      return res.status(200).json({ success: true, biddingHistory });
    } catch (error) {
      next(error);
    }
  }

  async onAuctionWon(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;

      const auctionsWon = await this.interactor.getWonAuction(id);
      return res.status(200).json({ success: true, auctionsWon });
    } catch (error) {
      next(error);
    }
  }

  async onAdminVerifyAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      await this.interactor.verifyAuction(id);
      return res
        .status(200)
        .json({ success: true, message: "Auction verified successfully" });
    } catch (error) {
      next(error);
    }
  }

  async onFilterAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filter } = req.query;

      const auctions = await this.interactor.filterAuction(filter);
      const count = await this.interactor.getCount(filter);
      return res.status(200).json({
        success: true,
        message: "auction filtered successfully",
        auctions,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async onBlockAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const auction = await this.interactor.blockAuction(id);
      return res.status(200).json({
        success: true,
        message: "auction blocked/unblocked successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async onSearchAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { search } = req.query;

      const auctions = await this.interactor.searchAuction(search?.toString()!);
      return res.status(200).json({
        success: true,
        message: "search auction successfully",
        auctions,
      });
    } catch (error) {
      next(error);
    }
  }

  async onGetCompletedAuction(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const auctions = await this.interactor.getCompletedAuction(id);

      return res.status(200).json({
        success: true,
        message: "completed auction retreived successfull",
        auctions,
      });
    } catch (error) {
      next(error);
    }
  }
  async onGetAuctionWon(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { auctionId } = req.params;

      const auction = await this.interactor.getAuctionWonByAuction(auctionId);
      return res.status(200).json({
        success: true,
        message: " auction retreived successfull",
        auction,
      });
    } catch (error) {
      next(error);
    }
  }

  async onGetAdminDashboard(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.interactor.getMonthlyRevenue();
      const count = await this.interactor.getAuctionDetails();

      return res.status(200).json({
        success: true,
        data,
        count,
      });
    } catch (error) {
      next(error);
    }
  }
}
