import { CreateFileModal } from "@/components/modals/CreateFileModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentSkeleton } from "@/components/ui/LoadingSkeleton";
import { useDocumentStore } from "@/hooks/useDocumentStore";
import type { File, FileType } from "@/types/document";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Edit, FileText, Plus, Trash2, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { files, isLoading, setCurrentFile, deleteFile, createFile } =
    useDocumentStore();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    file?: File;
  }>({ isOpen: false });
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);

  const handleCreateFile = () => {
    setShowCreateFileModal(true);
  };

  const handleConfirmCreateFile = async (
    name: string,
    fileType: FileType,
    uploadedFile?: globalThis.File
  ) => {
    const newFile = await createFile(
      name,
      fileType,
      null,
      fileType === "txt" ? "<p>Commencez à écrire...</p>" : "",
      uploadedFile
    );

    if (fileType === "txt") {
      navigate(`/editor/${newFile.id}`);
    }
  };

  const handleEditFile = (file: File) => {
    // Si c'est un fichier texte, changer le fichier actuel et naviguer vers l'éditeur
    if (file.fileType === "txt") {
      setCurrentFile(file);
      navigate(`/editor/${file.id}`);
    } else {
      // Pour png/pdf, ouvrir directement dans un nouvel onglet sans changer le fichier actuel
      window.open(file.content, "_blank");
    }
  };

  const handleDeleteFile = (file: File) => {
    setDeleteModal({ isOpen: true, file });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.file) {
      await deleteFile(deleteModal.file.id);
    }
    setDeleteModal({ isOpen: false });
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const recentFiles = files
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
        <DocumentSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Gérez vos documents et suivez votre activité
          </p>
        </div>
        <Button onClick={handleCreateFile} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau fichier
        </Button>
      </div>

      {/* Documents récents */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Fichiers récents
          </h2>
        </div>

        {files.length === 0 ? (
          <EmptyState
            title="Aucun document"
            description="Commencez par créer votre premier document pour organiser vos idées et votre travail."
            action={{
              label: "Créer un document",
              onClick: handleCreateFile,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFiles.map((file) => (
              <Card
                key={file.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* En-tête */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {file.name}
                      </h3>
                      {file.isDirty && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {file.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {file.description}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {file.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(file.updatedAt)}
                      </div>
                    </div>

                    {/* Tags */}
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{file.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFile(file)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Ouvrir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateFileModal
        isOpen={showCreateFileModal}
        onClose={() => setShowCreateFileModal(false)}
        onConfirm={handleConfirmCreateFile}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.file?.name}
        warningMessage="Le contenu de ce fichier sera définitivement perdu."
      />
    </div>
  );
};

export default DashboardPage;
