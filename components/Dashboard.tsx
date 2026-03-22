'use client'

import { useState, useEffect } from "react"
import { OrganizationProfile, OrganizationSwitcher, useOrganization, useOrganizationList } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import CreateBoardDialog from "./CreateBoardDialog"
import EditBoardDialog from "./EditBoardDialog"
import DeleteBoardDialog from "./DeleteBoardDialog"
import { Pencil, Trash2 } from "lucide-react"

export default function Dashboard() {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const { membership } = useOrganization({
    memberships: {
      infinite: true,
    },
  });

  // if (userMemberships.data?.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="mb-8">
  //         <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
  //         <p className="mt-2 text-muted-foreground">
  //           Manage your boards across all your organizations
  //         </p>
  //       </div>
  //
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>No Organizations Yet</CardTitle>
  //           <CardDescription>
  //             You need to create or join an organization to start using boards. 
  //             Organizations can be managed through Clerk.
  //           </CardDescription>
  //         </CardHeader>
  //       </Card>
  //     </div>
  //   )
  // }

  // const selectedOrganization = userMemberships.data?.find(
  //   (membership) => membership.organization.id === selectedOrgId
  // )?.organization

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your boards for the selected organization
        </p>
      </div>

      <OrganizationSwitcher />

      {membership ? membership.organization.name : "no"}

      {/* Selected Organization Boards */}
    </div>
  )
}

interface OrganizationCardProps {
  organization: {
    id: string
    name: string
    slug?: string | null
    imageUrl?: string | null
    membersCount?: number | undefined
  }
}

function OrganizationCard({ organization }: OrganizationCardProps) {
  const boards = useQuery(api.boards.getOrganizationBoards, {
    clerkOrgId: organization.id
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {organization.imageUrl && (
              <img
                src={organization.imageUrl}
                alt={organization.name}
                className="w-10 h-10 rounded-lg"
              />
            )}
            <div>
              <CardTitle>{organization.name}</CardTitle>
              {organization.membersCount && (
                <CardDescription>
                  {organization.membersCount} member{organization.membersCount !== 1 ? 's' : ''}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <CreateBoardDialog clerkOrgId={organization.id}>
              <Button variant="outline" size="sm">
                Add Board
              </Button>
            </CreateBoardDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Boards Grid */}
        {!boards ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No boards yet. Create your first board to get started.
            </p>
            <CreateBoardDialog clerkOrgId={organization.id}>
              <Button variant="outline">Create First Board</Button>
            </CreateBoardDialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board: Doc<"boards">) => (
              <Card key={board._id} className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{board.name}</CardTitle>
                      {board.description && (
                        <CardDescription className="text-sm line-clamp-2">
                          {board.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <EditBoardDialog board={board}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </EditBoardDialog>
                      <DeleteBoardDialog board={board}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </DeleteBoardDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(board._creationTime).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Navigate to board
                        console.log("Open board:", board._id)
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
