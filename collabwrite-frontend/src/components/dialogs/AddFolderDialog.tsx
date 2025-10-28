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

type AddDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddFolder?: (name: string) => void
}

export function AddFolderDialog({ open, onOpenChange, onAddFolder }: AddDialogProps) {
    const [name, setName] = useState("");

    const handleAdd = () =>  {
        if(onAddFolder && name.trim()){
            onAddFolder(name.trim())
            setName("")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajout d'un dossier</DialogTitle>
                    <DialogDescription>Ajout d'un dossier</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nom :</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" onClick={() => onOpenChange(false)}>Fermer</Button>
                    </DialogClose>
                    <Button onClick={handleAdd}>Ajouter</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}