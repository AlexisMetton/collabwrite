import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type DeleteFolderDialog = {
    open: boolean
    onOpenChange: (open: boolean) => void
    folderName: string,
    onDeleteFolder?: (name: string) => void
}

export function DeleteFolderDialog({ open, onOpenChange, folderName, onDeleteFolder }: DeleteFolderDialog) {
    const handleDelete = () => {
        if(onDeleteFolder && folderName.trim()){
            onDeleteFolder(folderName.trim())
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Suppression du dossier {folderName}</DialogTitle>
                    <DialogDescription>Etes-vous sûr de vouloir supprimer le dossier {folderName} ?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" onClick={() => onOpenChange(false)}>Fermer</Button>
                    </DialogClose>
                    <Button onClick={handleDelete}>Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}