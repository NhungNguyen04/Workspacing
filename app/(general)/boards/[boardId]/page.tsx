'use client'

import { useParams, useRouter } from 'next/navigation'
import { BoardInterface } from '@/components/board/board'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBoardStore } from '@/store/BoardStore'
import { fetchBoard } from './index'

export default function BoardPage() {
  const params = useParams()
  const boardId = params?.boardId as string
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  const { activeBoard, isLoading, error, setActiveBoard, setLoading, setError, previousUrl } = useBoardStore()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn && typeof boardId === 'string') {
      loadBoard(boardId)
    }
  }, [isLoaded, isSignedIn, boardId])

  const loadBoard = async (boardId: string) => {
    setLoading(true)
    const data = await fetchBoard(boardId)
    if (data) {
      setActiveBoard(data)
    } else {
      setError('Failed to load board')
    }
    setLoading(false)
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleBack = () => {
    router.push(previousUrl || '/')
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <p className="text-destructive text-lg">Board not found</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!activeBoard) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <p className="text-destructive text-lg">Can't fetch board</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-auto" style={{ background: activeBoard.color.startsWith('http') ? `url(${activeBoard.color}) center/cover` : activeBoard.color }}>
      <BoardInterface />
    </div>
  )
}

