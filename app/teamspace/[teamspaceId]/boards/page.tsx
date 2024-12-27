'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
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
import { MessageCircleQuestionIcon as QuestionMarkCircle, Pencil, Trash2, Router } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getBoards, createBoard, updateBoard, deleteBoard, fetchImages } from '.'
import { Board } from '@/types/board'
import { useBoardStore } from '@/store/BoardStore'

function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 95%)`
}

export default function BoardsPage() {
  const params = useParams()
  const router = useRouter();
  const { boards, setBoards, isLoading, setLoading, error, setError, previousUrl, setPreviousUrl } = useBoardStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const teamspaceId = params?.teamspaceId as string
  const [images, setImages] = useState<Array<Record<string, any>>>([])
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("")
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoadingImages(true)
        setImageError(null)
        const fetchedImages = await fetchImages()
        if (fetchedImages) {
          setImages(fetchedImages)
        } else {
          setImageError('Failed to load images')
        }
      } catch (error) {
        console.error('Error loading images:', error)
        setImageError('Failed to load images')
      } finally {
        setIsLoadingImages(false)
      }
    }
    loadImages()
  }, [])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const data = await getBoards(teamspaceId)
      setBoards(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load boards. Please try again.',
        variant: 'destructive',
      })
      setError('Failed to load boards')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBoard = async () => {
    if (!newTitle.trim()) return;
    
    try {
      setIsProcessing(true)
      const newBoard = await createBoard(teamspaceId, {
        title: newTitle,
        color: selectedImageUrl? selectedImageUrl : generatePastelColor(), // Add the selected image URL
        imageUrl: selectedImageUrl, // Add the selected image URL
      })
      setBoards([...boards, newBoard])
      setNewTitle("")
      setSelectedImageUrl("") // Reset selected image
      toast({ title: 'Success', description: 'Board created successfully.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create board. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateBoard = async (id: string, updatedTitle: string) => {
    try {
      setIsProcessing(true)
      const updatedBoard = await updateBoard(teamspaceId, id, updatedTitle)
      setBoards(boards.map(board => board.id === id ? updatedBoard : board))
      setEditingBoard(null)
      toast({ title: 'Success', description: 'Board updated successfully.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update board. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteBoard = async (id: string) => {
    try {
      setIsProcessing(true)
      await deleteBoard(teamspaceId, id)
      setBoards(boards.filter(board => board.id !== id))
      toast({ title: 'Success', description: 'Board deleted successfully.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete board. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNavigate = async (id: string) => {
    router.push(`/boards/${id}`)
    setPreviousUrl(window.location.pathname)
  }

  useEffect(() => {
    if (boards) return
    if (teamspaceId && !boards) {
      fetchBoards()
    }
  }, [teamspaceId, boards])

  if (isLoading) {
    return <div className="p-6 text-center">Loading boards...</div>
  }

  return (
    <div className="p-6 max-w-[660px] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Boards</h1>
      <div className="grid grid-cols-3 gap-4">
        {boards.map((board) => (
                <Card
                key={board.id}
                className="w-[200px] h-[200px] p-4 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center relative"
                style={{ background: board.color.startsWith('http') ? `url(${board.color}) center/cover` : board.color }}
                onClick={() => handleNavigate(board.id)}
                >
                {board.color.startsWith('http') && (
                  <div className="absolute inset-0 bg-slate-200 bg-opacity-20"></div>
                )}
                {editingBoard?.id === board.id ? (
                  <Input
                  value={editingBoard.title}
                  onChange={(e) => setEditingBoard({ ...editingBoard, title: e.target.value })}
                  onBlur={() => handleUpdateBoard(board.id, editingBoard.title)}
                  className="text-lg font-semibold text-center bg-transparent border-none"
                  autoFocus
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-center text-wrap">{board.title}</h2>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingBoard(board)
                  }}
                  disabled={isProcessing} // Disable button while processing
                  >
                  <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteBoard(board.id)
                  }}
                  disabled={isProcessing} // Disable button while processing
                  >
                  <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Card className="w-[200px] h-[200px] p-4 cursor-pointer hover:shadow-lg transition-shadow bg-gray-50 flex flex-col items-center justify-center gap-2">
              <h2 className="text-lg font-semibold">Create new</h2>
              <QuestionMarkCircle className="w-6 h-6 text-gray-400" />
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Board</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter board title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTitle.trim()) { // Removed selectedImageUrl check
                    handleAddBoard()
                  }
                }}
                disabled={isProcessing} // Disable input while processing
              />
              
              <div className="grid grid-cols-3 gap-2 min-h-[200px]">
                {isLoadingImages ? (
                  <div className="col-span-3 flex items-center justify-center">
                    Loading images...
                  </div>
                ) : imageError ? (
                  <div className="col-span-3 flex items-center justify-center text-red-500">
                    {imageError}
                  </div>
                ) : images.length === 0 ? (
                  <div className="col-span-3 flex items-center justify-center">
                    No images available
                  </div>
                ) : (
                  images.map((image) => (
                    <div
                      key={image.id}
                      className={`
                        relative aspect-video cursor-pointer overflow-hidden rounded-lg
                        ${selectedImageUrl === image.urls.regular ? 'ring-2 ring-4 ring-green-200' : ''}
                      `}
                      onClick={() => setSelectedImageUrl(image.urls.regular)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || 'Unsplash image'}
                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                      />
                    </div>
                  ))
                )}
              </div>

              <Button 
                onClick={handleAddBoard} 
                disabled={!newTitle.trim() || isProcessing} // Removed selectedImageUrl check
              >
                {isProcessing ? 'Processing...' : 'Create Board'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

