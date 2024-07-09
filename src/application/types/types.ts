import { Request } from "express";
import { Document, Schema } from "mongoose";

export interface OtpType {
  userId: string | Schema.Types.ObjectId;
  otp: string;
  expireData: Date;
}

export interface IRequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
    token?: string;
  };
}
