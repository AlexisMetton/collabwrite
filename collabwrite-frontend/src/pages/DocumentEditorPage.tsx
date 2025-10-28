import { Editor } from "@/components/editor/Editor";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import { ArrowLeft, FileText, Save, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const DocumentEditorPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le document au montage du composant
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

  const handleContentChange = (content: string) => {
    setDocumentContent(content);

    // Débouncer la mise à jour du store (500ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentFile) {
        updateFile(currentFile.id, { content });
      }
    }, 500);
  };

  const handleTitleChange = (title: string) => {
    setDocumentTitle(title);

    // Débouncer la mise à jour du titre
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentFile) {
        updateFile(currentFile.id, { name: title });
      }
    }, 500);
  };

  const handleSave = async () => {
    if (currentFile) {
      // Annuler tout debounce en cours
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

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
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
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

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
        <Editor
          key={currentFile.id}
          content={documentContent}
          onContentChange={handleContentChange}
          onSave={handleSave}
          placeholder="Commencez à écrire votre contenu..."
          className="h-full"
        />
      </div>
    </div>
  );
};

export default DocumentEditorPage;
