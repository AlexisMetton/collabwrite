import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socketService } from "@/services/socket.service";
import { Loader2, Send, Users, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface Message {
  id: string;
  documentId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  userId: string;
  userFullName: string;
  userEmail: string;
}

interface DocumentChatProps {
  documentId: string;
  onClose?: () => void;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({
  documentId,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialiser la connexion WebSocket
    const initSocket = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Vous devez être connecté");
        return;
      }

      const socketInstance = socketService.connect(token);
      setSocket(socketInstance);

      // Rejoindre le document
      socketInstance.emit("join:document", { documentId, token });

      // Écouter les événements
      socketInstance.on("joined:document", () => {
        setIsLoading(false);
        loadMessages();
      });

      socketInstance.on("message:new", (message: Message) => {
        setMessages((prev) => {
          // Éviter les doublons - vérifier si le message existe déjà
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      });

      socketInstance.on("users:list", (users: User[]) => {
        setConnectedUsers(users);
      });

      socketInstance.on("user:joined", (user: User) => {
        toast.success(`${user.userFullName} a rejoint la conversation`);
      });

      socketInstance.on("user:left", (user: { userFullName: string }) => {
        toast.info(`${user.userFullName} a quitté la conversation`);
      });

      socketInstance.on(
        "user:typing",
        (user: { userId: string; userFullName: string }) => {
          setTypingUsers((prev) => new Set(prev).add(user.userFullName));
        }
      );

      socketInstance.on("user:stopped-typing", (user: { userId: string }) => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          // Trouver et supprimer l'utilisateur
          connectedUsers.forEach((u) => {
            if (u.userId === user.userId) {
              updated.delete(u.userFullName);
            }
          });
          return updated;
        });
      });

      socketInstance.on("error", (error: { message: string }) => {
        toast.error(error.message);
      });
    };

    initSocket();

    return () => {
      if (socket) {
        socket.emit("leave:document", { documentId });
        socket.off("joined:document");
        socket.off("message:new");
        socket.off("users:list");
        socket.off("user:joined");
        socket.off("user:left");
        socket.off("user:typing");
        socket.off("user:stopped-typing");
        socket.off("error");
      }
    };
  }, [documentId]);

  // Charger les messages existants depuis l'API
  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000/api"
        }/messages/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  // Envoyer un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket) return;

    setIsSending(true);

    try {
      const token = localStorage.getItem("accessToken");
      socket.emit("message:send", {
        documentId,
        content: newMessage.trim(),
        token,
      });

      setNewMessage("");

      // Arrêter l'indicateur de saisie
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("typing:stop", { documentId });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  // Gérer l'indicateur de saisie
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket && e.target.value.length > 0) {
      socket.emit("typing:start", { documentId });

      // Réinitialiser le timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing:stop", { documentId });
      }, 1000);
    }
  };

  // Formater la date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Discussion</h3>
            <p className="text-xs text-muted-foreground">
              {connectedUsers.length} connecté(s)
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Aucun message pour le moment</p>
            <p className="text-sm">Soyez le premier à écrire !</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 ||
              formatDate(messages[index - 1].createdAt) !==
                formatDate(message.createdAt);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {message.userFullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">
                        {message.userFullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-1 break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
            <span>
              {Array.from(typingUsers).join(", ")} est en train d'écrire...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Écrivez un message..."
            value={newMessage}
            onChange={handleInputChange}
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={isSending || !newMessage.trim()}>
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentChat;
