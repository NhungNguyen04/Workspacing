'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { BoardInterface } from '@/components/board/board'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBoardStore } from '@/store/BoardStore'
import { fetchBoard, fetchColumns } from './index'
import { set } from 'lodash'
import {useAuth} from '@clerk/nextjs'
import {Board} from '@/types/board'
import {Column} from '@/types/column'

export default function BoardPage() {
  const params = useParams()
  const boardId = params?.boardId as string
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const { orgId } = useAuth()
  const [error, setError] = useState(false)
  const { 
    activeBoard, 
    setActiveBoard, 
    setColumns,
    columns 
  } = useBoardStore()

  useEffect(() => {
    if (!boardId) return;

    fetchBoard(boardId)
      .then((data) => {
        if (!data) {
          setError(true);
          return;
        }
        setActiveBoard(data);
        setColumns(data.columns || []);
      })
      .catch((error) => {
        setError(true);
      });
  }, [boardId])

  // Remove the second useEffect since we're handling columns in the first one

  if(!orgId) {
    redirect('/select-org');
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!activeBoard) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        : activeBoard.color,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      imageRendering: '-webkit-optimize-contrast'
    }}>
      <BoardInterface />
    </div>
  )
}

