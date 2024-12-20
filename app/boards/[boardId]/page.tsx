'use client'

import { useParams, useRouter } from 'next/navigation'
import { Board } from '@/components/board/board'
import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Board as BoardType } from '@/types/board'


export default function BoardPage() {
  const params = useParams()
  const boardId = params?.boardId as string
  const [loading, setIsLoading] = useState(false);
  const [board, setBoard] = useState<BoardType|null>(null);
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn && typeof boardId === 'string') {
      fetchBoard(boardId)
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
    router.push('/')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const fetchBoard = async (boardId: any) => {
    setIsLoading(true);
    try{
      const response = await fetch(`/api/teamspace/boards/${boardId}`);
      console.log("response", response)
      if(!response.ok) {
        toast({ title: "Error", description: "Failed to fetch content" });
        setError(((error as unknown) as Error).message || 'Failed to load content')
        throw new Error('Failed to fetch content');

      } else {
        const data = await response.json();
        setBoard(data);
      } 
    } catch(error) {
      console.error('Error fetching content:', error);
      toast({ title: "Error", description: "Failed to fetch content" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!board) {
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
    <div className="container mx-auto px-4">
      <Board boardId={boardId} boardTitle={board?.title} />
    </div>
  )
}

