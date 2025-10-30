import { socketService } from "@/services/socket.service";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

interface CollaborationUser {
  userId: string;
  userFullName: string;
  userEmail: string;
}

interface CursorData {
  userId: string;
  userName: string;
  from: number;
  to: number;
}

interface UseDocumentCollaborationProps {
  documentId: string;
  userId: string;
  userName: string;
  onContentUpdate: (content: string, fromUserId: string) => void;
  onCursorUpdate?: (cursors: CursorData[]) => void;
}

export const useDocumentCollaboration = ({
  documentId,
  userId,
  userName,
  onContentUpdate,
  onCursorUpdate,
}: UseDocumentCollaborationProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<CollaborationUser[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<CursorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Connexion au serveur Socket.io
  useEffect(() => {
    if (!documentId || !userId) {
      return;
    }

    const initSocket = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      const socketInstance = socketService.connect(token);
      socketRef.current = socketInstance;
      setSocket(socketInstance);

      // Si déjà connecté, rejoindre immédiatement
      if (socketInstance.connected) {
        setIsConnected(true);
        socketInstance.emit("join:document", { documentId, token });
      }

      // Écouter l'événement de connexion
      socketInstance.on("connect", () => {
        setIsConnected(true);
        socketInstance.emit("join:document", { documentId, token });
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      // Événement : document rejoint avec succès
      socketInstance.on("joined:document", (data: Document) => {
        // Connexion réussie
        console.log(data);
      });

      // Événement : liste des utilisateurs connectés
      socketInstance.on("users:list", (users: CollaborationUser[]) => {
        setConnectedUsers(users);
      });

      // Événement : un utilisateur a rejoint
      socketInstance.on("user:joined", (user: CollaborationUser) => {
        console.log(user);
      });

      // Événement : un utilisateur a quitté
      socketInstance.on("user:left", (user: { userFullName: string }) => {
        console.log(user);
      });

      // Événement : réception des changements de contenu
      socketInstance.on(
        "document:content-updated",
        (data: { content: string; userId: string; documentId?: string }) => {
          if (data.userId !== userId) {
            onContentUpdate(data.content, data.userId);
          }
        }
      );

      // Événement : réception des positions de curseur
      socketInstance.on("cursor:moved", (data: CursorData) => {
        if (data.userId !== userId) {
          setRemoteCursors((prev) => {
            const filtered = prev.filter((c) => c.userId !== data.userId);
            return [...filtered, data];
          });
        }
      });

      // Événement : erreur
      socketInstance.on("error", (error: { message: string }) => {
        toast.error(error.message);
      });

      // Si déjà connecté, rejoindre immédiatement
      if (socketInstance.connected) {
        socketInstance.emit("join:document", { documentId, token });
      }
    };

    initSocket();

    // Nettoyage à la déconnexion
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave:document", { documentId });
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("joined:document");
        socketRef.current.off("users:list");
        socketRef.current.off("user:joined");
        socketRef.current.off("user:left");
        socketRef.current.off("document:content-updated");
        socketRef.current.off("cursor:moved");
        socketRef.current.off("error");
      }
    };
  }, [documentId, userId, onContentUpdate]);

  // Fonction pour envoyer les changements aux autres utilisateurs
  const sendContentUpdate = useCallback(
    (content: string) => {
      if (socketRef.current && documentId) {
        socketRef.current.emit("document:update-content", {
          documentId,
          content,
          userId,
        });
      }
    },
    [documentId, userId]
  );

  // Fonction pour envoyer la position du curseur
  const sendCursorUpdate = useCallback(
    (position: { from: number; to: number }) => {
      if (socketRef.current && documentId) {
        socketRef.current.emit("cursor:move", {
          documentId,
          userId,
          userName,
          from: position.from,
          to: position.to,
        });
      }
    },
    [documentId, userId, userName]
  );

  // Notifier les changements de curseurs
  useEffect(() => {
    if (onCursorUpdate) {
      onCursorUpdate(remoteCursors);
    }
  }, [remoteCursors, onCursorUpdate]);

  return {
    socket,
    connectedUsers,
    remoteCursors,
    isConnected,
    sendContentUpdate,
    sendCursorUpdate,
  };
};
