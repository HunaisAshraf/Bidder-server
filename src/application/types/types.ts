import { Document, Schema } from "mongoose";

export interface OtpType {
  userId: string | Schema.Types.ObjectId;
  otp: string;
  expireData: Date;
}
