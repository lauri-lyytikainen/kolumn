'use client'

import { useState } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

interface EditBoardDialogProps {
  children: React.ReactNode
  board: Doc<"boards">
  onSuccess?: () => void
}

export default function EditBoardDialog({ children, board, onSuccess }: EditBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(board.name)
  const [description, setDescription] = useState(board.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateBoard = useMutation(api.boards.updateBoard)

  // Reset form when board changes or dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName(board.name)
      setDescription(board.description || "")
    }
    setOpen(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await updateBoard({
        boardId: board._id,
        name: name.trim(),
        description: description.trim() || undefined,
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to update board:", error)
      alert(error instanceof Error ? error.message : "Failed to update board")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
          <DialogDescription>
            Update your board details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="edit-board-name" className="text-sm font-medium">
              Board Name
            </label>
            <Input
              id="edit-board-name"
              type="text"
              placeholder="Project Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-board-description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="edit-board-description"
              placeholder="A brief description of this board..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? "Updating..." : "Update Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}