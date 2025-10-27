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
    folderName: string
}

export function DeleteFolderDialog({ open, onOpenChange, folderName }: DeleteFolderDialog) {
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}