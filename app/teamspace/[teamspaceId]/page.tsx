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
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MessageCircleQuestionIcon as QuestionMarkCircle, Pencil, Trash2, Router } from 'lucide-react'
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css' 
import { getBoards, createBoard, updateBoard, deleteBoard, fetchImages } from '@/lib/api/teamspaceboard'
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
  const [selectedImageUrl, setSelectedImageUrl] = useState<any>({})
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [imageError, setImageError] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null)
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
        setLoading(true);
        const response = await getBoards(teamspaceId);
        const data = response;
        
        if (error) {
            throw new Error(error);
        }
        
        setBoards(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load boards';
        toast.error(errorMessage);
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  }

  const handleAddBoard = async () => {
    if (!newTitle.trim()) return;
    
    try {
        setIsProcessing(true);
        const color = selectedImageUrl?.regular || generatePastelColor();
        
        const newBoard = await createBoard(teamspaceId, {
            title: newTitle,
            color: selectedImageUrl ? selectedImageUrl.regular : color,
            imageThumbUrl: selectedImageUrl?.thumb,
            imageFullUrl: selectedImageUrl?.full,
        });

        if (!newBoard || !newBoard.id) {
            throw new Error('Invalid board data received');
        }
        
        setBoards([...boards, newBoard]);
        setNewTitle("");
        setSelectedImageUrl(null);
        toast.success('Board created successfully.');
    } catch (error) {
        console.error('Error creating board:', error);
        toast.error('Failed to create board. Please try again.');
    } finally {
        setIsProcessing(false);
    }
  }

  const handleUpdateBoard = async (id: string, updatedTitle: string) => {
    try {
      setIsProcessing(true)
      const updatedBoard = await updateBoard(teamspaceId, id, updatedTitle)
      setBoards(boards.map(board => board.id === id ? updatedBoard : board))
      setEditingBoard(null)
      toast.success('Board updated successfully.')
    } catch (error) {
      toast.error('Failed to update board. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteBoard = async (id: string) => {
    try {
      setIsProcessing(true)
      await deleteBoard(teamspaceId, id)
      setBoards(boards.filter(board => board.id !== id))
      toast.success('Board deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete board. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNavigate = async (id: string) => {
    router.push(`/boards/${id}`)
    setPreviousUrl('/teamspace/' + teamspaceId)
  }

  const startEditing = (board: Board) => {
    setEditingBoard(board)
    setEditTitle(board.title)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingBoard || !editTitle.trim()) return
    
    try {
      setIsProcessing(true)
      await handleUpdateBoard(editingBoard.id, editTitle)
      setEditDialogOpen(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const startDeleting = (board: Board) => {
    setBoardToDelete(board)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!boardToDelete) return
    
    try {
      setIsProcessing(true)
      await handleDeleteBoard(boardToDelete.id)
      setDeleteDialogOpen(false)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (boards.length > 0) {
      console.log(boards);
      return
    }
    else if (teamspaceId) {
      fetchBoards()
    }
  }, [teamspaceId]) // Remove boards from dependency array

  if (isLoading) {
    return <div className="p-6 text-center">Loading boards...</div>
  }

  return (
    <div className="p-4 sm:p-6 mx-auto max-w-[1600px]">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="w-full aspect-[3/2] p-4 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center relative"
            style={{ background: board.imageThumbUrl ? `url(${board.imageThumbUrl})` : board.color, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
            onClick={() => handleNavigate(board.id)}
          >
            {board.imageThumbUrl && (
              <div className="absolute inset-0 bg-neutral-100 bg-opacity-40 rounded-lg"></div>
            )}
            <div className="relative z-10">
              <h2 className="text-lg font-semibold text-center text-wrap">{board.title}</h2>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  startEditing(board)
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
                  startDeleting(board)
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
            <Card className="w-full aspect-[3/2] p-4 cursor-pointer hover:shadow-lg transition-shadow bg-gray-50 flex flex-col items-center justify-center gap-2">
              <h2 className="text-lg font-semibold">Create new</h2>
              <QuestionMarkCircle className="w-6 h-6 text-gray-400" />
            </Card>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-3xl mx-4">
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 min-h-[200px]">
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
                        ${selectedImageUrl?.regular === image.urls.regular ? 'ring-4 ring-green-200' : ''}
                      `}
                      onClick={() => setSelectedImageUrl(image.urls)}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Board title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editTitle.trim()) {
                  handleSaveEdit()
                }
              }}
              disabled={isProcessing}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={!editTitle.trim() || isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Are you sure you want to delete the board titled "{boardToDelete?.title}"?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              disabled={isProcessing}
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

