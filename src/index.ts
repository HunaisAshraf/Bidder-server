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
import { config } from "./infrastructure/config/config";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDb();

const io = new Server(server, {
  cors: {
    origin: config.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: config.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/auction", auctionRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/chat", messageRouter);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/watchlist", watchListRoute);
app.use(errorHandler);

const joinedUsers: any = {};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  let roomId: string;

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    roomId = chatId;
  });

  socket.on("join_call", (user) => {
    io.to(roomId).emit("incoming_call", user);
  });

  socket.on("call_rejected", (chat) => {
    io.to(chat).emit("call_declined");
  });

  socket.on("send_notification", ({ user, newMessage, chat }) => {
    io.emit("notification_send", { user, newMessage });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const port = 5000;

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});

export { io };
