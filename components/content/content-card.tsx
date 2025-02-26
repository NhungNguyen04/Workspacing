import { useState } from 'react'
import Link from 'next/link'
import { Content } from '@/types/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2 } from 'lucide-react'
import { updateContent, deleteContent } from './index'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategorySelect } from './category-select'
import { useContentStore } from '@/store/ContentStore'
import { AddCategory } from './add-category'

interface ContentCardProps {
  content: Content
  onUpdate: (updatedContent: Content) => void
  onDelete: (id: string) => void
  setPreviousUrl: (url: string) => void
  onClick?: () => void;
}

export function ContentCard({ content, onUpdate, onDelete, setPreviousUrl, onClick }: ContentCardProps) {
  const { categories } = useContentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState(content.title)
  const [editingContent, setEditingContent] = useState(content.content || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    content.categories?.map(cat => cat.categoryId) || []
  )

  const handleUpdateContent = async () => {
    if (!editingTitle.trim()) {
      toast.error('Title is required');
      return;
    }
  
    try {
      const updatedContent = await updateContent(
        content.id, 
        editingTitle.trim(), 
        editingContent.trim(),
        selectedCategories
      );
      onUpdate(updatedContent);
      setIsEditing(false);
      toast.success('Content updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update content. Please try again.');
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleDeleteContent = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteContent(content.id)
      onDelete(content.id)
      toast.success('Content deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete content. Please try again.')
    }
  }

  return (
    <>
      <div 
        className="cursor-pointer group relative bg-white border border-gray-200 rounded-lg px-6 py-4 hover:shadow-lg transition-all duration-200" 
        onClick={onClick}
      >
        <div className="space-y-2">
          <p className="font-semibold text-md line-clamp-2">{content.title}</p>
          <div className="flex flex-wrap gap-1">
            {content.categories?.map(category => (
              <span
                key={category.categoryId}
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: category.category.color + '20',
                  color: category.category.name
                }}
              >
                {category.category.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Updated: {new Date(content.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={handleDeleteContent}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog 
        open={isEditing} 
        onOpenChange={setIsEditing}
      >
        <DialogContent 
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4" onClick={(e) => e.stopPropagation()}>
            <Input
              placeholder="Content title"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-sm font-medium">Categories</h4>
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
              onClick={(e) => {
                e.stopPropagation()
                handleUpdateContent()
              }}
              className="w-full"
            >
              Update Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
