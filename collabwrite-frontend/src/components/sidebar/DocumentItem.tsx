import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { File } from '@/types/document';
import { useDocumentStore } from '@/hooks/useDocumentStore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentItemProps {
  file: File;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ file }) => {
  const { currentFile, setCurrentFile, updateFile } = useDocumentStore();
  const navigate = useNavigate();
  const isActive = currentFile?.id === file.id;

  const handleClick = () => {
    // Si c'est un fichier texte, changer le fichier actuel et naviguer vers l'éditeur
    if (file.fileType === 'txt') {
      setCurrentFile(file);
      navigate(`/editor/${file.id}`);
    } else {
      // Pour png/pdf, ouvrir directement dans un nouvel onglet sans changer le fichier actuel
      window.open(file.content, '_blank');
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('fileId', file.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedFileId = e.dataTransfer.getData('fileId');

    // Si on drop un fichier sur lui-même, ne rien faire
    if (draggedFileId === file.id) {
      return;
    }

    // Déplacer le fichier draggé au même niveau que ce fichier (folderId)
    updateFile(draggedFileId, { folderId: file.folderId });
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={handleClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium text-sm text-foreground truncate">{file.name}</h3>
            {file.isDirty && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />}
          </div>
        </div>
        {file.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{file.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{file.author}</span>
          <span>{formatDate(file.updatedAt)}</span>
        </div>
        {file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                {tag}
              </span>
            ))}
            {file.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                +{file.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DocumentItem;
