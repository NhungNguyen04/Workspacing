import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface UpdateBoardDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdateBoard: (title: string) => void
  currentTitle: string
}

export function UpdateBoardDialog({ isOpen, onClose, onUpdateBoard, currentTitle }: UpdateBoardDialogProps) {
  const [title, setTitle] = useState(currentTitle)

  useEffect(() => {
    setTitle(currentTitle)
  }, [currentTitle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onUpdateBoard(title.trim())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Board Title</DialogTitle>
          <DialogDescription>
            Enter a new title for your board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board Title"
            className="mb-4"
          />
          <DialogFooter>
            <Button type="submit">Update Board</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

