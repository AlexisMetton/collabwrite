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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type RenameDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    folderName: string
}

export function DeleteFolderDialog({ open, onOpenChange, folderName }: RenameDialogProps) {
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