import axios from "axios";
import { Socket, Server as SocketIOServer } from "socket.io";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

interface JoinRoomData {
  documentId: string;
  token: string;
}

interface SendMessageData {
  documentId: string;
  content: string;
  token: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

// Store pour garder la trace des utilisateurs connectés par document
const documentRooms = new Map<string, Set<string>>();

export function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connecté: ${socket.id}`);

    // Rejoindre une room (document)
    socket.on("join:document", async (data: JoinRoomData) => {
      try {
        const { documentId, token } = data;

        if (!documentId || !token) {
          socket.emit("error", { message: "Document ID et token requis" });
          return;
        }

        // Vérifier l'authentification auprès de l'API
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user: User = response.data;

          // Rejoindre la room du document
          socket.join(`document:${documentId}`);

          // Stocker l'info utilisateur dans le socket
          (socket as any).userId = user.id;
          (socket as any).userFullName = user.fullName;
          (socket as any).userEmail = user.email;
          (socket as any).currentDocumentId = documentId;

          // Ajouter à la liste des utilisateurs connectés
          if (!documentRooms.has(documentId)) {
            documentRooms.set(documentId, new Set());
          }
          documentRooms.get(documentId)?.add(socket.id);

          console.log(`${user.fullName} a rejoint le document ${documentId}`);

          // Notifier les autres utilisateurs de la room
          socket.to(`document:${documentId}`).emit("user:joined", {
            userId: user.id,
            userFullName: user.fullName,
            userEmail: user.email,
          });

          // Envoyer la confirmation au client
          socket.emit("joined:document", {
            documentId,
            message: "Connecté au document avec succès",
          });

          // Envoyer la liste des utilisateurs connectés
          const connectedUsers = getConnectedUsers(io, documentId);
          io.to(`document:${documentId}`).emit("users:list", connectedUsers);
        } catch (error: any) {
          console.error(
            "Erreur d'authentification:",
            error.response?.data || error.message
          );
          socket.emit("error", {
            message: "Authentification échouée",
          });
        }
      } catch (error) {
        console.error("Erreur lors de join:document:", error);
        socket.emit("error", { message: "Erreur serveur" });
      }
    });

    // Envoyer un message
    socket.on("message:send", async (data: SendMessageData) => {
      try {
        const { documentId, content, token } = data;
        const userId = (socket as any).userId;
        const userFullName = (socket as any).userFullName;
        const userEmail = (socket as any).userEmail;

        if (!userId) {
          socket.emit("error", { message: "Non authentifié" });
          return;
        }

        if (!content || content.trim().length === 0) {
          socket.emit("error", { message: "Le message ne peut pas être vide" });
          return;
        }

        // Envoyer le message à l'API pour sauvegarde
        try {
          const response = await axios.post(
            `${API_URL}/messages/${documentId}`,
            { content: content.trim() },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const savedMessage = response.data;

          // Diffuser le message à tous les utilisateurs de la room
          io.to(`document:${documentId}`).emit("message:new", savedMessage);

          console.log(`Message de ${userFullName} dans document ${documentId}`);
        } catch (error: any) {
          console.error(
            "Erreur API lors de l'envoi du message:",
            error.response?.data || error.message
          );
          socket.emit("error", {
            message: "Impossible de sauvegarder le message",
          });
        }
      } catch (error) {
        console.error("Erreur lors de message:send:", error);
        socket.emit("error", { message: "Erreur serveur" });
      }
    });

    // Un utilisateur tape (typing indicator)
    socket.on("typing:start", (data: { documentId: string }) => {
      const userFullName = (socket as any).userFullName;
      const userId = (socket as any).userId;

      if (userId && userFullName) {
        socket.to(`document:${data.documentId}`).emit("user:typing", {
          userId,
          userFullName,
        });
      }
    });

    socket.on("typing:stop", (data: { documentId: string }) => {
      const userId = (socket as any).userId;

      if (userId) {
        socket.to(`document:${data.documentId}`).emit("user:stopped-typing", {
          userId,
        });
      }
    });

    // Quitter une room
    socket.on("leave:document", (data: { documentId: string }) => {
      handleLeaveDocument(socket, data.documentId, io);
    });

    // Déconnexion
    socket.on("disconnect", () => {
      const documentId = (socket as any).currentDocumentId;
      if (documentId) {
        handleLeaveDocument(socket, documentId, io);
      }
      console.log(`Client déconnecté: ${socket.id}`);
    });
  });
}

// Fonction helper pour gérer la déconnexion d'un document
function handleLeaveDocument(
  socket: Socket,
  documentId: string,
  io: SocketIOServer
) {
  const userId = (socket as any).userId;
  const userFullName = (socket as any).userFullName;

  if (documentId) {
    socket.leave(`document:${documentId}`);

    // Retirer de la liste des utilisateurs connectés
    const room = documentRooms.get(documentId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) {
        documentRooms.delete(documentId);
      }
    }

    // Notifier les autres utilisateurs
    if (userId && userFullName) {
      socket.to(`document:${documentId}`).emit("user:left", {
        userId,
        userFullName,
      });

      console.log(`${userFullName} a quitté le document ${documentId}`);

      // Mettre à jour la liste des utilisateurs
      const connectedUsers = getConnectedUsers(io, documentId);
      io.to(`document:${documentId}`).emit("users:list", connectedUsers);
    }
  }
}

// Obtenir la liste des utilisateurs connectés à un document
function getConnectedUsers(io: SocketIOServer, documentId: string) {
  const room = documentRooms.get(documentId);
  if (!room) return [];

  const users: Array<{
    userId: string;
    userFullName: string;
    userEmail: string;
  }> = [];

  room.forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      const userId = (socket as any).userId;
      const userFullName = (socket as any).userFullName;
      const userEmail = (socket as any).userEmail;

      if (userId && userFullName) {
        users.push({ userId, userFullName, userEmail });
      }
    }
  });

  return users;
}
