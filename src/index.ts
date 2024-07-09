import express from "express";
import http from "http";
import { connectDb } from "./infrastructure/db/dbConnection";
import dotenv from "dotenv";
import { errorHandler } from "./infrastructure/middlewares/errorHandler";
import { userRouter } from "./infrastructure/routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { auctionRouter } from "./infrastructure/routes/auctionRoute";
import { paymentRouter } from "./infrastructure/routes/paymentRoute";
import { messageRouter } from "./infrastructure/routes/messageRoute";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import "./infrastructure/scheduler/auctionSchedule";
import { notificationRoute } from "./infrastructure/routes/notificationRoute";
import { watchListRoute } from "./infrastructure/routes/watchListRoute";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDb();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", userRouter);
app.use("/api/auction", auctionRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/chat", messageRouter);
app.use("/api/notification", notificationRoute);
app.use("/api/watchlist", watchListRoute);
app.use(errorHandler);

const joinedUsers: any = {};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  let roomId: string;

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    roomId = chatId;
    console.log("connected to chat id", chatId);
  });

  socket.on("join_call", (user) => {
    console.log("join call", user);

    io.to(roomId).emit("incoming_call", user);
  });

  socket.on("call_rejected", (chat) => {
    console.log("reject", chat);

    io.to(chat).emit("call_declined");
  });

  socket.on("send_notification", ({ user, newMessage, chat }) => {
    io.emit("notification_send", { user, newMessage });
  });

  // socket.on("join_call", ({ room, user }) => {
  //   console.log("joining call");

  // if (joinedUsers[room]) {
  //   joinedUsers[room].push(user);
  // } else {
  //   joinedUsers[room] = [user];
  // }

  // console.log("connected to video chat ", room, user);
  // console.log(joinedUsers);

  // io.to(room).emit("user-joined", user);
  // });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const port = 5000;

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});

export { io };
