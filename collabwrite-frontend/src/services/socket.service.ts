import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_REALTIME_URL || "http://localhost:3001";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("Connecté au serveur WebSocket");
      });

      this.socket.on("disconnect", () => {
        console.log("Déconnecté du serveur WebSocket");
      });

      this.socket.on("error", (error: { message: string }) => {
        console.error("Erreur WebSocket:", error.message);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
