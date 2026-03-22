'use client'

import { useState } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

interface DeleteBoardDialogProps {
  children: React.ReactNode
  board: Doc<"boards">
  onSuccess?: () => void
}

export default function DeleteBoardDialog({ children, board, onSuccess }: DeleteBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteBoard = useMutation(api.boards.deleteBoard)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBoard({ boardId: board._id })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to delete board:", error)
      alert(error instanceof Error ? error.message : "Failed to delete board")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Board</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{board.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}