import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/authService";
import { IRequestWithUser } from "../../application/types/types";

const auth = new AuthService();

export const isAuthenticated = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }
    const { _id, role } = auth.verifyToken(token!);
    req.user = { id: _id.toString(), role, token };

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
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }

    const { _id, role } = auth.verifyToken(token!);

    if (role !== "bidder") {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isAuctioner = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }

    const { _id, role } = auth.verifyToken(token!);

    if (role !== "auctioner") {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }

    req.user = { id: _id.toString(), role };

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }

    const { _id, role } = auth.verifyToken(token!);

    if (role !== "admin") {
      return res
        .status(400)
        .send({ success: false, error: "user not authorised" });
    }
    req.user = { id: _id.toString(), role };

    next();
  } catch (error) {
    next(error);
  }
};
