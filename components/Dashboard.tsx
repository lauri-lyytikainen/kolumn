'use client'

import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs"
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import CreateBoardDialog from "./CreateBoardDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "./ui/spinner";
import Board from "./Board";

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
            >
              <Button variant="outline">
                <Plus className="mr-2" />
                Create your first board
              </Button>
            </CreateBoardDialog>
          </div>
        ) : (
          // Board list
          boards.map((board, index) => (
            <Board board={board} key={index} />
          ))
        )}
      </div>
    </div>
  )
}


