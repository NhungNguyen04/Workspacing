'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, File, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

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
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn) {
      fetchContents()
    }
  }, [isLoaded, isSignedIn, router])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/contents')
      if (!response.ok) throw new Error('Failed to fetch contents')
      const data = await response.json()
      const mappedData = data.map((item) => ({
        id: item._id,
        title: item.title,
        updatedAt: item.updatedAt
      }))
      setContents(mappedData)
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast({
        title: 'Error',
        description: 'Failed to load contents. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContent = async () => {
    if (!newContentTitle.trim()) return
    setIsCreating(true)
    try {
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newContentTitle }),
      })
      if (!response.ok) throw new Error('Failed to create content')
      const newContent = await response.json()
      setContents([...contents, newContent])
      setNewContentTitle('')
      toast({
        title: 'Success',
        description: 'New content created successfully.',
      })
    } catch (error) {
      console.error('Error creating content:', error)
      toast({
        title: 'Error',
        description: 'Failed to create new content. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isLoaded || !isSignedIn) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Content</h1>
      <div className="flex justify-between items-center mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Content
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
                defaultValue="New content"
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
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((content) => (
            <Link
              key={content.id}
              href={`/contents/${content.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <File className="h-5 w-5 mr-2" />
                <span className="font-semibold">{content.title}</span>
              </div>
              <div className="text-sm text-gray-500">
                Updated: {new Date(content.updatedAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
      {!isLoading && filteredContents.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No contents found. Try adjusting your search or create a new content.
        </div>
      )}
    </div>
  )
}