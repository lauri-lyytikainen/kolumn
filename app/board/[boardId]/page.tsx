'use client'
import { use } from 'react'

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = use(params)

  return (
    <div>
      <p>{boardId}</p>
    </div>
  )
}
