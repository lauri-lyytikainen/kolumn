import { Ellipsis, FolderInput, Pen, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Doc } from "@/convex/_generated/dataModel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface BoardProps {
  board: Doc<"boards">
}

export default function Board({ board }: BoardProps) {
  const deleteBoard = useMutation(api.boards.deleteBoard);

  return (
    <Card key={board._id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="min-h-24">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg mb-2 truncate">{board.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Pen />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderInput />
                    Move
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <DropdownMenuItem variant="destructive" >
                        <Trash />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanetly delete this board.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancle
                        </AlertDialogCancel>
                        <AlertDialogAction variant={"destructive"} onClick={() => deleteBoard({ boardId: board._id })}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

  )
}
