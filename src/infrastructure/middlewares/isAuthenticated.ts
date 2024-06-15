import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/authService";

const auth = new AuthService();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).send({ success: false, error: "user not authorised" });
    }
    const { _id, role } = auth.verifyToken(token!);
    next();
  } catch (error) {
    next(error);
  }
};

export const isBidder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).send({ success: false, error: "user not authorised" });
    }

    const { _id, role } = auth.verifyToken(token!);

    if (role !== "bidder") {
      res.status(400).send({ success: false, error: "user not authorised" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isAuctioner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).send({ success: false, error: "user not authorised" });
    }

    const { _id, role } = auth.verifyToken(token!);

    if (role !== "auctioner") {
      res.status(400).send({ success: false, error: "user not authorised" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
