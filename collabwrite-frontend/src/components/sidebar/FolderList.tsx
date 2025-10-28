import { useDocumentStore } from "@/hooks/useDocumentStore";
import { FileText } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { EmptyState } from "../ui/EmptyState";
import { DocumentItem } from "./DocumentItem";
import { FolderItem } from "./FolderItem";
import { folderService } from "@/services/folder.service";

interface FolderListProps {
  fileTypeFilter?: "all" | "txt" | "image" | "pdf";
}

export const FolderList: React.FC<FolderListProps> = ({
  fileTypeFilter = "all",
}) => {
  const {
    isLoading,
    files,
    searchQuery,
    sortBy,
    sortOrder,
    updateFile,
  } = useDocumentStore();
  const [isDragOverRoot, setIsDragOverRoot] = React.useState(false);

  const [error, setError] = useState("");
  const [folders, setFolders] = useState([]);
  
  const getFolders = async () => {
    try{
      const folders = await folderService.getFolders();
      setFolders(folders);
    }
    catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setError(error.response?.data?.error || "Erreur lors de la récupération des dossiers.")
    }
  }

    // Mémoriser les résultats de recherche et filtrage pour améliorer les performances
  const { visibleFolders, rootFiles } = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    // Filtrer les dossiers qui contiennent des fichiers correspondant à la recherche
    const filteredFolders = folders.filter((folder) => {
      if (!searchQuery) return true;

      const folderFiles = files.filter((file) => file.folderId === folder.id);
      const matchingFiles = folderFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchLower) ||
          file.content.toLowerCase().includes(searchLower) ||
          file.author.toLowerCase().includes(searchLower) ||
          (file.description &&
            file.description.toLowerCase().includes(searchLower))
      );

      return matchingFiles.length > 0;
    });

    // Récupérer les fichiers sans dossier (racine)
    let filteredRootFiles = files.filter((file) => file.folderId === null);

    // Appliquer le filtre de type
    if (fileTypeFilter !== "all") {
      filteredRootFiles =
        fileTypeFilter === "image"
          ? filteredRootFiles.filter((file) => file.fileType === "png")
          : filteredRootFiles.filter((file) => file.fileType === fileTypeFilter);
    }

    // Appliquer la recherche
    if (searchQuery) {
      filteredRootFiles = filteredRootFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchLower) ||
          file.content.toLowerCase().includes(searchLower) ||
          file.author.toLowerCase().includes(searchLower) ||
          (file.description &&
            file.description.toLowerCase().includes(searchLower))
      );
    }

    // Appliquer le tri
    filteredRootFiles.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "updatedAt":
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return {
      visibleFolders: filteredFolders,
      rootFiles: filteredRootFiles,
    };
  }, [files, folders, searchQuery, fileTypeFilter, sortBy, sortOrder]);
  
  useEffect(() => {
    getFolders();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="Aucun dossier"
          description="Créez votre premier dossier pour organiser vos pages."
          action={{
            label: "Créer un dossier",
            onClick: () => {
              console.log("Créer un dossier");
            },
          }}
        />
      </div>
    );
  }

  // Vérifier s'il y a des résultats (dossiers OU fichiers racine)
  if (visibleFolders.length === 0 && rootFiles.length === 0 && searchQuery) {
    return (
      <div className="p-4">
        <EmptyState
          title="Aucun résultat"
          description="Aucun fichier ne correspond à votre recherche."
        />
      </div>
    );
  }

  // Drag and drop handlers pour la zone racine
  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOverRoot(true);
  };

  const handleDragLeaveRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverRoot(false);
  };

  const handleDropRoot = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverRoot(false);

    const fileId = e.dataTransfer.getData("fileId");
    if (fileId) {
      // Déplacer le fichier à la racine (sans dossier)
      updateFile(fileId, { folderId: null });
    }
  };

  return (
    <div className="p-4 space-y-2">
      {/* Fichiers sans dossier */}
      <div
        className={`space-y-2 mb-4 p-2 rounded-lg transition-colors ${
          isDragOverRoot ? "bg-primary/10 ring-2 ring-primary" : ""
        } ${
          rootFiles.length === 0
            ? "min-h-[60px] border-2 border-dashed border-muted-foreground/20"
            : ""
        }`}
        onDragOver={handleDragOverRoot}
        onDragLeave={handleDragLeaveRoot}
        onDrop={handleDropRoot}
      >
        <div className="flex items-center gap-2 px-2 py-1">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {rootFiles.length > 0
              ? "Fichiers"
              : "Fichiers (Glissez ici pour retirer d'un dossier)"}
          </span>
        </div>
        {rootFiles.map((file) => (
          <DocumentItem key={file.id} file={file} />
        ))}
      </div>

      {/* Dossiers */}
      {visibleFolders.length > 0 && (
        <div className="space-y-2">
          {visibleFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              fileTypeFilter={fileTypeFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderList;
