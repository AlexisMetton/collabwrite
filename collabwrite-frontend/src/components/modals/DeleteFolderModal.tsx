import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Folder } from "@/types/document";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  folder: Folder | null;
}

export const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  folder,
}) => {
  if (!folder) return null;

  const handleConfirm = () => {
    onConfirm(folder.name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le dossier {folder.name}
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer le
            dossier {folder.name} ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded flex items-center justify-center"
                style={{ backgroundColor: folder.color }}
              >
                <span className="text-white text-sm">📁</span>
              </div>
              <div>
                <p className="font-medium">{folder.name}</p>
                {/*                 <p className="text-sm text-muted-foreground">
                  Créé le {folder.createdAt.toLocaleDateString('fr-FR')}
                </p> */}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Attention : Tous les fichiers de ce dossier seront également
              supprimés !
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Supprimer définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFolderModal;
