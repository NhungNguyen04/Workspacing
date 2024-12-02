'use client'

import { useParams } from 'next/navigation'
import { Board } from '@/components/board'

export default function BoardPage() {
  const params = useParams()
  const boardId = params.boardId as string

  // In a real application, you would fetch the board title based on the boardId
  const boardTitle = `Board ${boardId}`

  return (
    <div className="container mx-auto px-4">
      <Board boardId={boardId} boardTitle={boardTitle} />
    </div>
  )
}

