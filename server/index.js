import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import { userRouter } from "./routes/user.js";
import { messageRouter } from "./routes/message.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8001;

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000", // Update with the correct origin
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", userRouter);
app.use("/messages", messageRouter);

app.use(cors(corsOptions));

mongoose.connect(
  "mongodb+srv://arnab192023:9755@chatapp.4iauwvw.mongodb.net/chatapp?retryWrites=true&w=majority"
);

const server = app.listen(PORT, () => {
  console.log("connected to Mongodb Database");
  console.log(`listening to port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
