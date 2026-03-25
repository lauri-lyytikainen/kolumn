'use client'

import { useState } from "react"
import { useMutation } from "convex/react"
import { useOrganizationList, useUser } from "@clerk/nextjs"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

interface MoveBoardDialogProps {
  children: React.ReactNode
  board: Doc<"boards">
  onSuccess?: () => void
}

export default function MoveBoardDialog({ children, board, onSuccess }: MoveBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useUser()
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  const moveBoard = useMutation(api.boards.moveBoard)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrgId) return

    setIsSubmitting(true)
    try {
      await moveBoard({
        boardId: board._id,
        newOrgId: selectedOrgId,
      })

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to move board:", error)
      alert(error instanceof Error ? error.message : "Failed to move board")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setSelectedOrgId("")
    }
    setOpen(newOpen)
  }

  const organizations = userMemberships?.data || []
  const availableOrgs = organizations.filter(
    (membership) => membership.organization.id !== board.clerkOrgId
  )

  // Check if the board is NOT in the user's personal account and add personal account as an option
  const isInPersonalAccount = board.clerkOrgId === user?.id
  const canMoveToPersonal = !isInPersonalAccount && user?.id

  const totalAvailableOptions = availableOrgs.length + (canMoveToPersonal ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Board</DialogTitle>
          <DialogDescription>
            Move "{board.name}" to a different organization or your personal account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="move-board-org" className="text-sm font-medium">
              Select Destination
            </label>
            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose destination..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Organizations
                  </SelectLabel>
                  {totalAvailableOptions === 0 ? (
                    <SelectItem value={user!.id}>
                      No other organizations available
                    </SelectItem>
                  ) : (
                    <>
                      {canMoveToPersonal && (
                        <SelectItem value={user!.id}>
                          Personal Account
                        </SelectItem>
                      )}
                      {availableOrgs.map((membership) => (
                        <SelectItem
                          key={membership.organization.id}
                          value={membership.organization.id}
                        >
                          {membership.organization.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
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
              disabled={isSubmitting || !selectedOrgId || totalAvailableOptions === 0}
            >
              {isSubmitting ? "Moving..." : "Move Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
