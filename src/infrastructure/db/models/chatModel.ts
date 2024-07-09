import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
});

export const ChatModel = mongoose.model("Chat", chatSchema);
