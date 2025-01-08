'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { createContent } from '@/components/content/index'
import { useContentStore } from '@/store/ContentStore'
import { CategorySelect } from './category-select'
import { AddCategory } from './add-category'

export function AddContent() {
  const { contents, setContents, categories } = useContentStore()
  const [newContentTitle, setNewContentTitle] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  console.log('Categories from store:', categories) // Add this debug line

  const handleCreateContent = async () => {
    if (!newContentTitle.trim()) return
    setIsCreating(true)
    try {
      const newContent = await createContent(newContentTitle, selectedCategories)
      setContents([...contents, newContent])
      setNewContentTitle('')
      setSelectedCategories([])
      toast.success('New content created successfully.')
    } catch (error) {
      toast.error('Failed to create new content. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="font-semibold">
          <Plus className="mr-2 h-5 w-5" /> New Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter content title"
            value={newContentTitle}
            onChange={(e) => setNewContentTitle(e.target.value)}
            className="w-full"
          />
          <h4 className="text-sm font-medium leading-none mb-2">Categories</h4>
            <div className="min-h-[100px] space-y-2"> 
              <CategorySelect
                categories={categories}
                selectedCategories={selectedCategories}
                onSelect={handleCategorySelect}
              />
              <AddCategory 
                onCategoryAdded={() => {}} 
              />
            </div>
          <Button 
            onClick={handleCreateContent} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Content'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
