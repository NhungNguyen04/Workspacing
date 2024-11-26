"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { CreateBoardDialog } from './create-board-dialog'
import { UpdateBoardDialog } from './update-board-dialog'
import { boardService } from '@/services/boardService'
import { Board } from '@/types/board'

const pastelColors = [
  'bg-red-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-yellow-100',
  'bg-pink-100',
  'bg-purple-100',
  'bg-indigo-100',
]

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const teamspaceId = 'your-teamspace-id' // Replace with actual teamspace ID

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const fetchedBoards = await boardService.getBoards(teamspaceId)
      setBoards(fetchedBoards)
    } catch (error) {
      console.error('Failed to fetch boards', error)
    }
  }

  const updateBoardTitle = async (newTitle: string) => {
    if (currentBoard) {
      try {
        await boardService.updateBoard(teamspaceId, { id: currentBoard.id, title: newTitle, teamspaceId })
        fetchBoards()
        setIsUpdateDialogOpen(false)
      } catch (error) {
        console.error('Failed to update board title', error)
      }
    }
  }

  const deleteBoard = async (boardId: string) => {
    try {
      await boardService.deleteBoard(boardId, teamspaceId)
      fetchBoards()
    } catch (error) {
      console.error('Failed to delete board', error)
    }
  }

  const createBoard = async (title: string) => {
    try {
      await boardService.createBoard(teamspaceId, { title, teamspaceId })
      fetchBoards()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create board', error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {boards.map((board, index) => (
          <Card 
            key={board.id} 
            className={`${pastelColors[index % pastelColors.length]} hover:shadow-lg transition-shadow aspect-square flex flex-col`}
          >
            <CardHeader className="flex-grow p-4">
              <CardTitle className="text-base font-bold line-clamp-2">{board.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end p-4 pt-0">
              <p className="text-xs text-muted-foreground mt-auto">
                Created: {new Date(board.createdAt).getFullYear()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                setCurrentBoard(board)
                setIsUpdateDialogOpen(true)
              }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => deleteBoard(board.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card 
          className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-accent"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-muted-foreground">Create new board</p>
        </Card>
      </div>
      <CreateBoardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateBoard={createBoard}
      />
      <UpdateBoardDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onUpdateBoard={updateBoardTitle}
        currentTitle={currentBoard?.title || ''}
      />
    </div>
  )
}

