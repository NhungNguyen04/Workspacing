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
import {
  fetchContents,
  handleCreateContent,
  handleUpdateTitle,
  handleDeleteContent,
} from './index'

interface Content {
  id: string
  title: string
  updatedAt: string
}

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newContentTitle, setNewContentTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn) {
      fetchContents(setContents, setIsLoading, toast)
    }
  }, [isLoaded, isSignedIn, router])

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
                <Button onClick={() => handleCreateContent(newContentTitle, setContents, setNewContentTitle, setIsCreating, toast)} disabled={isCreating}>
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
            >
              <div className="flex items-center mb-2">
                {editingId === content.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateTitle(content.id, editingTitle, setContents, setEditingId, toast)
                  }} className="flex-1">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full"
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
                    handleDeleteContent(content.id, setContents, toast)
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