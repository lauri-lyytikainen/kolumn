'use client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { user } = useUser();
  const { boardId } = use(params)
  const board = useQuery(api.boards.getBoard, { boardId: boardId as Id<"boards"> });

  if (!user || !board) {
    return (<div className='min-h-screen flex flex-col justify-center items-center'>
            <Spinner className='size-8'/>
            Loading Board...
    </div>)
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='min-h-16 flex gap-2 justify-between p-4'>
        <div className='flex gap-2 items-center'>
          <Link href="/dashboard">
            <Button size={"icon"} variant={"ghost"}>
              <ArrowLeft />
            </Button>
          </Link>
          <span>Organization</span>
          /
          <span>{board?.name}</span>
        </div>
      </div>
      <p>{boardId}</p>
    </div>
  )
}
