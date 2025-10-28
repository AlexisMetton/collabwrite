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
import { useState } from "react"

type RenameDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    folderName: string
    onUpdateFolder?: (oldname: string, newname: string) => void
}

export function RenameFolderDialog({ open, onOpenChange, folderName, onUpdateFolder }: RenameDialogProps) {
    const [newname, setNewName] = useState("");

    const handleUpdate = () => {
        if(onUpdateFolder && newname.trim()){
            onUpdateFolder(folderName, newname)
            setNewName("");
            onOpenChange(false);
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modification du dossier {folderName}</DialogTitle>
                    <DialogDescription>Modifier le nom du dossier {folderName}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nom :</Label>
                        <Input value={newname} onChange={e => setNewName(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" onClick={() => onOpenChange(false)}>Fermer</Button>
                    </DialogClose>
                    <Button onClick={handleUpdate}>Modifier</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}