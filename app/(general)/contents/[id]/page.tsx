'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { getContent, updateContent } from '.'
import 'react-toastify/dist/ReactToastify.css'
import { useContentStore } from '@/store/ContentStore'

const TinyMCEEditor = dynamic(() => import('@/components/content/tinymce-editor'), { ssr: false })


export default function ContentEditorPage() {
  const { activeContent, setActiveContent, isLoading, setLoading, error, setError, previousUrl } = useContentStore()
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { id } = params ?? {}
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    } else if (isSignedIn && typeof id === 'string') {
      fetchContent()
    }
  }, [isLoaded, isSignedIn, id])

  const fetchContent = async () => {
    if (typeof id !== 'string') return
    setLoading(true)
    try {
      const data = await getContent(id)
      // Convert string dates to Date objects and ensure categories is included
      setActiveContent({
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        categories: data.categories || [] // Ensure categories is included with a default empty array
      })
    } catch (error) {
      console.error('Error fetching content:', error)
      setError(error instanceof Error ? error.message : 'Failed to load content')
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!activeContent || typeof id !== 'string') return
    setIsSaving(true)
    try {
      await updateContent(id, activeContent)
      toast.success('Content saved successfully.')
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    handleSave()
    router.push(previousUrl || '/')
  }

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome to show the confirmation dialog
      toast.info('Your content is being saved.');
      await handleSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

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

  if (!activeContent) {
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
          value={activeContent.title}
          onChange={(e) => setActiveContent({ ...activeContent, title: e.target.value })}
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
        value={activeContent.content}
        onChange={(value) => setActiveContent({ ...activeContent, content: value })}
      />
    </div>
  )
}
