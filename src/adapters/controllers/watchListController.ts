import { NextFunction, Request, Response } from "express";
import { IWatchListInteractor } from "../../application/interfaces/watchList/IWatchListInteractor";
import { IRequestWithUser } from "../../application/types/types";

export class WatchListController {
  private interactor: IWatchListInteractor;
  constructor(interactor: IWatchListInteractor) {
    this.interactor = interactor;
  }

  async onGetListInteractor(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;

      const watchLists = await this.interactor.getList(id);
      console.log(watchLists);

      return res.status(200).json({
        success: true,
        message: "watchlist retrieved successfully",
        watchLists,
      });
    } catch (error) {
      next(error);
    }
  }

  async onAddToList(req: IRequestWithUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      const { auctionId } = req.params;
      const watchList = await this.interactor.addToList(auctionId, id);

      return res.status(200).json({
        success: true,
        message: "watchlist added successfully",
        watchList,
      });
    } catch (error) {
      next(error);
    }
  }

  async onRemoveFromList(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { auctionId } = req.params;
      await this.interactor.removeFromList(auctionId);
      return res.status(200).json({
        success: true,
        message: "watchlist removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async onCheckWatchList(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user!;
      const { auctionId } = req.params;
      const watchList = await this.interactor.checkList(auctionId, id);
      return res.status(200).json({
        success: true,
        message: "available in watchlist",
        watchList,
      });
    } catch (error) {
      next(error);
    }
  }
}
