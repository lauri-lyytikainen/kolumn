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

interface CreateBoardDialogProps {
  children: React.ReactNode
  clerkOrgId: string
}

export default function CreateBoardDialog({ children, clerkOrgId }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createBoard = useMutation(api.boards.createBoard)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await createBoard({
        clerkOrgId,
        name: name.trim(),
        description: description.trim() || undefined,
      })

      // Reset form and close dialog
      setName("")
      setDescription("")
      setOpen(false)

    } catch (error) {
      console.error("Failed to create board:", error)
      alert(error instanceof Error ? error.message : "Failed to create board")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Create a new kanban board for this organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="board-name" className="text-sm font-medium">
              Board Name
            </label>
            <Input
              id="board-name"
              type="text"
              placeholder="Project Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="board-description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="board-description"
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
              {isSubmitting ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
