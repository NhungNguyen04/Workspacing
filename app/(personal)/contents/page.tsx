'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MoreVertical,
  Plus,
  Search,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { getContents, createContent, updateContent, deleteContent } from './index'
import { useContentStore } from '@/store/ContentStore'
import { Content } from '@/types/content'

export default function ContentPage() {
  const { contents, setContents, isLoading, setLoading, error, setError, previousUrl, setPreviousUrl } = useContentStore()
  const [newContentTitle, setNewContentTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;
      setLoading(true);
      try {
        const data = await getContents();
        const mappedData: Content[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          userId: item.userId
        }));
        setContents(mappedData);
      } catch (error) {
        toast.error('Failed to load contents');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, router, setContents, setLoading]); // Removed contents from dependencies

  const handleCreateContent = async () => {
    if (!newContentTitle.trim()) return
    setIsCreating(true)
    try {
      const newContent = await createContent(newContentTitle)
      setContents([...contents, newContent])
      setNewContentTitle('')
      toast.success('New content created successfully.')
    } catch (error) {
      toast.error('Failed to create new content. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateTitle = async (id: string, title: string, content: string) => {
    try {
      const updatedContent = await updateContent(id, title, content)
      setContents(contents.map(content => content.id === id ? updatedContent : content))
      setEditingId(null)
      toast.success('Content updated successfully.')
    } catch (error) {
      toast.error('Failed to update content. Please try again.')
    }
  }

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id)
      setContents(contents.filter(content => content.id !== id))
      toast.success('Content deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete content. Please try again.')
    }
  }

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Your contents</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search contents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Enter content title"
                  value={newContentTitle}
                  onChange={(e) => setNewContentTitle(e.target.value)}
                />
                <Button onClick={handleCreateContent} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContents.map((content) => (
            <Link
              key={content.id}
              href={`/contents/${content.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group"
              onClick={() => {setPreviousUrl(window.location.pathname)}}
            >
              <div className="flex items-center mb-2">
                {editingId === content.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateTitle(content.id, editingTitle, editingContent)
                  }} className="flex-1">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full mt-2"
                    />
                  </form>
                ) : (
                  <span className="font-semibold">{content.title}</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Updated: {new Date(content.updatedAt).toLocaleString()}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setEditingId(content.id)
                    setEditingTitle(content.title)
                    setEditingContent(content.content)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteContent(content.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filteredContents.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-lg">No contents found</p>
          <p className="text-sm">Create a new content or try a different search</p>
        </div>
      )}
    </div>
  )
}