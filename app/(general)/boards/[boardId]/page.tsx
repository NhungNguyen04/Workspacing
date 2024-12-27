'use client'

import { useParams, useRouter } from 'next/navigation'
import { BoardInterface } from '@/components/board/board'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBoardStore } from '@/store/BoardStore'
import { fetchBoard } from './index'
import { set } from 'lodash'

export default function BoardPage() {
  const params = useParams()
  const boardId = params?.boardId as string
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  
  const { activeBoard, isLoading, error, setActiveBoard, setLoading, setError, previousUrl } = useBoardStore()

  useEffect(() => {
    if (activeBoard?.id === boardId) return
    if (!boardId) return
    if (boardId) {
      fetchBoard(boardId)
        .then((board) => {
          setActiveBoard(board)
          setLoading(false)
          setError(null)
        })
        .catch((error) => {
          setError(error instanceof Error ? error.message : 'An error occurred')
          setLoading(false)
        })
    }
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } 
  }, [isLoaded, isSignedIn, boardId])

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

  // Show loading state first
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Only show error if we're not loading and there's an actual error
  if (!isLoading && error) {
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

  // Only show this if we're not loading and board is null
  if (!isLoading && !activeBoard) {
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
    <div className="h-full w-auto" style={{ 
      backgroundImage: activeBoard?.imageFullUrl 
        ? `url(${activeBoard.imageFullUrl})`
        : 'none',
      backgroundColor: activeBoard?.imageFullUrl 
        ? 'transparent'
        : activeBoard?.color,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      imageRendering: '-webkit-optimize-contrast'
    }}>
      <BoardInterface />
    </div>
  )
}

