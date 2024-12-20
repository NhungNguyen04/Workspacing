import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

interface Content {
  id: string
  title: string
  updatedAt: string
}

export const fetchContents = async (
  setContents: Dispatch<SetStateAction<Content[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  toast: any
) => {
  try {
    const response = await fetch('/api/contents')
    if (!response.ok) throw new Error('Failed to fetch contents')
    const data = await response.json()
    const mappedData = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      updatedAt: item.updatedAt,
    }))
    setContents(mappedData)
  } catch (error) {
    toast.error('Failed to load contents. Please try again.')
  } finally {
    setIsLoading(false)
  }
}

export const handleCreateContent = async (
  newContentTitle: string,
  setContents: Dispatch<SetStateAction<Content[]>>,
  setNewContentTitle: Dispatch<SetStateAction<string>>,
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  toast: any
) => {
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
    setContents((prevContents) => [...prevContents, newContent])
    setNewContentTitle('')
    toast.success('New content created successfully.')
  } catch (error) {
    toast.error('Failed to create new content. Please try again.')
  } finally {
    setIsCreating(false)
  }
}

export const handleUpdateTitle = async (
  id: string,
  editingTitle: string,
  setContents: Dispatch<SetStateAction<Content[]>>,
  setEditingId: Dispatch<SetStateAction<string | null>>,
  toast: any
) => {
  try {
    const response = await fetch(`/api/contents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editingTitle }),
    })
    if (!response.ok) throw new Error('Failed to update content')
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.id === id ? { ...content, title: editingTitle } : content
      )
    )
    setEditingId(null)
    toast.success('Content title updated successfully.')
  } catch (error) {
    toast.error('Failed to update content title. Please try again.')
  }
}

export const handleDeleteContent = async (
  id: string,
  setContents: Dispatch<SetStateAction<Content[]>>,
  toast: any
) => {
  try {
    const response = await fetch(`/api/contents/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete content')
    setContents((prevContents) => prevContents.filter((content) => content.id !== id))
    toast.success('Content deleted successfully.')
  } catch (error) {
    toast.error('Failed to delete content. Please try again.')
  }
}
