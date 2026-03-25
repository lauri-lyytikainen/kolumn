import { ArrowRight, Ellipsis, FolderInput, Pen, Trash } from "lucide-react";
import { Button } from "./ui/button";
import type { Doc } from "@/convex/_generated/dataModel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import EditBoardDialog from "./EditBoardDialog";
import MoveBoardDialog from "./MoveBoardDialog";
import Link from "next/link";
import Image from 'next/image'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";

interface BoardProps {
  board: Doc<"boards">
}

export default function Board({ board }: BoardProps) {
  const deleteBoard = useMutation(api.boards.deleteBoard);

  function DeleteAlert() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem variant="destructive" onSelect={(e: any) => e.preventDefault()}>
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
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={() => deleteBoard({ boardId: board._id })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Item key={board._id} variant={"outline"} className="p-4">
      <ItemMedia variant={"image"}>
        <Image
          src={"https://api.dicebear.com/9.x/shapes/svg?seed=" + board._id}
          width={64}
          height={64}
          unoptimized
          className="object-cover rounded-sm"
          alt="avatar" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {board.name}
        </ItemTitle>
        <ItemDescription>
          {board.description ?? "No Description"}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <EditBoardDialog board={board}>
                <DropdownMenuItem onSelect={(e: any) => e.preventDefault()}>
                  <Pen />
                  Edit
                </DropdownMenuItem>
              </EditBoardDialog>
              <MoveBoardDialog board={board}>
                <DropdownMenuItem onSelect={(e: any) => e.preventDefault()}>
                  <FolderInput />
                  Move
                </DropdownMenuItem>
              </MoveBoardDialog>
              <DeleteAlert />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size={"icon"} asChild>
          <Link href={"/board/" + board._id}>
            <ArrowRight />
          </Link>
        </Button>
      </ItemActions>
    </Item>
  )
}
