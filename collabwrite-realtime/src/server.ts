import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocketHandlers } from "./sockets/messageHandlers.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configuration Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middleware Express
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CollabWrite Realtime Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", connections: io.sockets.sockets.size });
});

// Configuration des gestionnaires Socket.IO
setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`CollabWrite Realtime Server running on port ${PORT}`);
  console.log(`WebSocket ready for connections`);
});

export { io };
