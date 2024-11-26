"use client"

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MessageCircleQuestionIcon as QuestionMarkCircle, Pencil, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// Generate a random pastel color
function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 95%)`
}

interface Board {
  id: number
  title: string
  color: string
  updatedAt: string
}

interface CreateBoardInput {
  title: string
  color: string
}

interface UpdateBoardInput {
  title: string
}

export default function BoardPage() {
  const params = useParams()
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { teamspaceId } = params ?? {}
  const [newTitle, setNewTitle] = useState("")
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const maxBoards = 9
  const remaining = maxBoards - boards.length

  const fetchBoards = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/${teamspaceId}/boards`)
      if (!response.ok) throw new Error('Failed to fetch boards')
      const data = await response.json()
      setBoards(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load boards. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [teamspaceId])

  const handleAddBoard = async () => {
    if (boards.length < maxBoards && newTitle.trim()) {
      try {
        const newBoard: CreateBoardInput = {
          title: newTitle,
          color: generatePastelColor(),
        }
        const response = await fetch(`/api/${teamspaceId}/boards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBoard),
        })
        if (!response.ok) throw new Error('Failed to create board')
        const createdBoard = await response.json()
        setBoards([...boards, createdBoard])
        setNewTitle("")
        toast({
          title: 'Success',
          description: 'Board created successfully.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to create board. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleUpdateBoard = async (id: number, updatedTitle: string) => {
    try {
      const updateData: UpdateBoardInput = { title: updatedTitle }
      const response = await fetch(`/api/${teamspaceId}/boards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      if (!response.ok) throw new Error('Failed to update board')
      const updatedBoard = await response.json()
      setBoards(boards.map(board => board.id === id ? updatedBoard : board))
      setEditingBoard(null)
      toast({
        title: 'Success',
        description: 'Board updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update board. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteBoard = async (id: number) => {
    try {
      const response = await fetch(`/api/${teamspaceId}/boards/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete board')
      setBoards(boards.filter(board => board.id !== id))
      toast({
        title: 'Success',
        description: 'Board deleted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete board. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center">Loading boards...</div>
  }

  return (
    <div className="p-6 max-w-[660px] mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="w-[200px] h-[200px] p-4 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center relative"
            style={{ backgroundColor: board.color }}
          >
            {editingBoard?.id === board.id ? (
              <Input
                value={editingBoard.title}
                onChange={(e) => setEditingBoard({ ...editingBoard, title: e.target.value })}
                onBlur={() => handleUpdateBoard(board.id, editingBoard.title)}
                className="text-lg font-semibold text-center bg-transparent border-none"
                autoFocus
              />
            ) : (
              <h2 className="text-lg font-semibold text-center">{board.title}</h2>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditingBoard(board)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteBoard(board.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {remaining > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Card className="w-[200px] h-[200px] p-4 cursor-pointer hover:shadow-lg transition-shadow bg-gray-50 flex flex-col items-center justify-center gap-2">
                <h2 className="text-lg font-semibold">Create new</h2>
                <p className="text-sm text-gray-600">{remaining} remaining</p>
                <QuestionMarkCircle className="w-6 h-6 text-gray-400" />
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Enter board title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddBoard()
                    }
                  }}
                />
                <Button onClick={handleAddBoard} disabled={!newTitle.trim()}>
                  Create Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

