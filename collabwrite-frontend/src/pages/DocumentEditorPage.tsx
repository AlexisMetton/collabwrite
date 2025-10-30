import { AudioCallButton } from "@/components/audio/AudioCallButton";
import { AudioControls } from "@/components/audio/AudioControls";
import { AudioStreams } from "@/components/audio/AudioStreams";
import { ActiveUsers } from "@/components/collaboration/ActiveUsers";
import { EditorWithChat } from "@/components/editor/EditorWithChat";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentCollaboration } from "@/hooks/useDocumentCollaboration";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { useWebRTC } from "@/hooks/useWebRTC";
import { ArrowLeft, FileText, Save, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const DocumentEditorPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    files,
    currentFile,
    setCurrentFile,
    updateFile,
    saveFile,
    deleteFile,
    isSaving,
  } = useDocumentStore();

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [remoteVersion, setRemoteVersion] = useState(0);
  const [remoteCursors, setRemoteCursors] = useState<any[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le document au montage
  useEffect(() => {
    if (documentId) {
      const file = files.find((f) => f.id === documentId);
      if (file) {
        setCurrentFile(file);
        setDocumentTitle(file.name);
        setDocumentContent(file.content);
      }
    }
  }, [documentId, files, setCurrentFile]);

  // Gérer les mises à jour de contenu distantes
  const handleRemoteContentUpdate = useCallback(
    (content: string, fromUserId: string) => {
      // Appliquer immédiatement pour éviter la perte de données
      setDocumentContent(content);
      setRemoteVersion((v) => v + 1);

      // Mise à jour du store en différé (non critique)
      if (currentFile) {
        setTimeout(() => {
          updateFile(currentFile.id, { content }, false);
        }, 0);
      }
    },
    [currentFile?.id, updateFile]
  );

  // Hook de collaboration
  const {
    connectedUsers,
    isConnected,
    sendContentUpdate,
    sendCursorUpdate,
    remoteCursors: cursorData,
  } = useDocumentCollaboration({
    documentId: documentId || "",
    userId: user?.id || "",
    userName: user?.fullName || "Anonyme",
    onContentUpdate: handleRemoteContentUpdate,
    onCursorUpdate: (cursors) => {
      const cursorPositions = cursors.map((cursor) => ({
        userId: cursor.userId,
        userName: cursor.userName,
        color: getColorForUser(cursor.userId),
        position: { top: 0, left: cursor.from },
      }));
      setRemoteCursors(cursorPositions);
    },
  });

  // WebRTC pour les appels audio
  const {
    localStream,
    peers,
    isCallActive,
    isMuted,
    connectionStatus,
    error: audioError,
    startCall,
    endCall,
    toggleMute,
  } = useWebRTC({
    roomId: `document-${documentId}`,
    userId: user?.id || "anonymous",
    userName: user?.fullName || "Utilisateur anonyme",
  });

  // Gérer les changements locaux de contenu
  const handleContentChange = useCallback(
    (content: string) => {
      setDocumentContent(content);

      // Envoyer immédiatement via WebSocket (pas de debounce pour éviter la perte de données)
      sendContentUpdate(content);

      // Debouncer seulement la mise à jour du store local (non critique)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (currentFile) {
          updateFile(currentFile.id, { content }, false);
        }
      }, 500);
    },
    [sendContentUpdate, currentFile?.id, updateFile]
  );

  // Gérer les mouvements de curseur
  const handleCursorMove = useCallback(
    (position: { from: number; to: number }) => {
      sendCursorUpdate(position);
    },
    [sendCursorUpdate]
  );

  // Gérer les changements de titre
  const handleTitleChange = (title: string) => {
    setDocumentTitle(title);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentFile) {
        updateFile(currentFile.id, { name: title });
      }
    }, 500);
  };

  // Sauvegarder manuellement
  const handleSave = async () => {
    if (currentFile) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const updatedFile = {
        ...currentFile,
        name: documentTitle,
        content: documentContent,
      };
      await saveFile(updatedFile);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (isCallActive) {
        endCall();
      }
    };
  }, [isCallActive, endCall]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const getColorForUser = (userId: string): string => {
    const colors = [
      "#3B82F6", // blue
      "#10B981", // green
      "#F59E0B", // amber
      "#EF4444", // red
      "#8B5CF6", // purple
      "#EC4899", // pink
      "#14B8A6", // teal
      "#F97316", // orange
    ];
    const hash = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleDelete = async () => {
    if (
      currentFile &&
      confirm(
        `Êtes-vous sûr de vouloir supprimer le document "${currentFile.name}" ?`
      )
    ) {
      await deleteFile(currentFile.id);
      navigate("/dashboard");
    }
  };

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          title="Document non trouvé"
          description="Le document que vous recherchez n'existe pas ou a été supprimé."
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
          action={{
            label: "Retour au dashboard",
            onClick: handleBack,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">Éditeur de document</h1>
          </div>
          <ActiveUsers users={connectedUsers} currentUserId={user?.id} />
        </div>

        <div className="flex items-center gap-4">
          {currentFile.isDirty && (
            <span className="text-sm text-orange-500">• Non sauvegardé</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>

          <div className="flex items-center gap-2 border-l pl-4">
            {!isCallActive ? (
              <AudioCallButton
                onStartCall={startCall}
                connectionStatus={connectionStatus}
              />
            ) : (
              <AudioControls
                isMuted={isMuted}
                participants={Array.from(peers.entries()).map(([id, peer]) => ({
                  id,
                  hasStream: !!peer.stream,
                  userName: peer.userName,
                }))}
                onToggleMute={toggleMute}
                onEndCall={endCall}
              />
            )}
          </div>
        </div>
      </div>

      {audioError && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">
              !
            </div>
            <div>
              <p className="font-medium text-red-900">Erreur audio</p>
              <p className="text-sm text-red-700">{audioError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Métadonnées du document */}
      <Card className="p-4">
        <div className="space-y-2">
          <Label htmlFor="document-title">Titre du document</Label>
          <Input
            id="document-title"
            value={documentTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Entrez le titre du document..."
            className="text-lg font-medium"
          />
        </div>
      </Card>

      {/* Éditeur de contenu */}
      <div className="flex-1 min-h-0">
        <EditorWithChat
          key={currentFile.id}
          documentId={currentFile.id}
          documentName={documentTitle}
          content={documentContent}
          onContentChange={handleContentChange}
          onRemoteContentChange={(content) => setDocumentContent(content)}
          onSave={handleSave}
          placeholder="Commencez à écrire votre contenu..."
          remoteVersion={remoteVersion}
          cursors={remoteCursors}
          onCursorMove={handleCursorMove}
        />
      </div>

      <AudioStreams localStream={localStream} peers={peers} />
    </div>
  );
};

export default DocumentEditorPage;
