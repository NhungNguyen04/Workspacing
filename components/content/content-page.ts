import { toast } from '@/hooks/use-toast'

interface Content {
  _id: string
  title: string
  content: string
}

export const fetchContent = async (
  contentId: string,
  setContent: React.Dispatch<React.SetStateAction<Content | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
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

export const handleSave = async (
  content: Content | null,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  id: string
) => {
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
