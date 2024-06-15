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
import { Server } from "socket.io";
import "./infrastructure/scheduler/auctionSchedule"

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
app.use(errorHandler);

// io.on("connection", (socket) => {
//   console.log("socket connected", socket.id);

//   socket.on("disconnect", () => {
//     console.log("socket disconnected");
//   });
// });

const port = 5000;

server.listen(port, () => {
  console.log(`server running in port ${port}`);
});


export {io}