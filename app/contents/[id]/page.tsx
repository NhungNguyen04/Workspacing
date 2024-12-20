'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const TinyMCEEditor = dynamic(() => import('@/components/content/tinymce-editor'), { ssr: false })

interface Content {
  _id: string
  title: string
  content: string
}

export default function ContentEditorPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params ?? {} // Ensure params are destructured safely

  const [content, setContent] = useState<Content | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn && typeof id === 'string') {
      fetchContent(id)
    }
  }, [isLoaded, isSignedIn, id])

  const fetchContent = async (contentId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/contents/${contentId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
      setError(error instanceof Error ? error.message : 'Failed to load content')
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load content',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/contents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      toast({
        title: 'Success',
        description: 'Content saved successfully.',
      })
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save content',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    handleSave();
    router.push('/contents')
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content List
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <p className="text-destructive text-lg">Content not found</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content List
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4 space-x-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Input
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          className="text-2xl font-bold flex-1"
        />
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
      <TinyMCEEditor
        value={content.content}
        onChange={(value) => setContent({ ...content, content: value })}
      />
    </div>
  )
}
