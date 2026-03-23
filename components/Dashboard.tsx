'use client'

import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs"
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import CreateBoardDialog from "./CreateBoardDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "./ui/spinner";

export default function Dashboard() {
  const { organization } = useOrganization({
    memberships: {
      infinite: true,
    },
  });
  const { user } = useUser();

  const clerkOrgId = organization?.id || user?.id || "";
  const isPersonalWorkspace = !organization;

  const boards = useQuery(
    api.boards.getOrganizationBoards,
    clerkOrgId ? { clerkOrgId } : "skip"
  );

  const handleBoardCreated = () => {
    // The query will automatically refetch due to Convex reactivity
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Spinner className="size-8 mb-2" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col mx-auto px-4 py-8 gap-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your boards for the selected organization
        </p>
      </div>

      <div className="flex gap-2 justify-between align-middle">
        <h2 className="text-2xl font-bold">
          {organization ? organization.name : "Personal account"}
        </h2>
        <OrganizationSwitcher />
      </div>

      <div className="flex justify-end">
        <CreateBoardDialog
          clerkOrgId={clerkOrgId}
          onSuccess={handleBoardCreated}
        >
          <Button size="lg">
            <Plus />
            New Board
          </Button>
        </CreateBoardDialog>
      </div>

      {/* Selected Organization Boards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {!boards ? (
          // Loading state
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Spinner className="size-8 mb-2" />
              <p className="text-muted-foreground">Loading boards...</p>
            </div>
          </div>
        ) : boards.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">
              {isPersonalWorkspace
                ? "No boards in your personal workspace yet."
                : `No boards in ${organization?.name} yet.`
              }
            </p>
            <CreateBoardDialog
              clerkOrgId={clerkOrgId}
              onSuccess={handleBoardCreated}
            >
              <Button variant="outline">
                <Plus className="mr-2" />
                Create your first board
              </Button>
            </CreateBoardDialog>
          </div>
        ) : (
          // Board list
          boards.map((board) => (
            <Card key={board._id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="min-h-24">
                  <h3 className="font-semibold text-lg mb-2 truncate">{board.name}</h3>
                  {board.description && (
                    <p className="text-sm text-muted-foreground mb-2 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {board.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(board._creationTime).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}


