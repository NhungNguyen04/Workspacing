import { create } from 'zustand'
import { Content } from '@/types/content'

interface ContentState {
  contents: Content[]
  activeContent: Content | null
  isLoading: boolean
  error: string | null
  previousUrl: string| null
  
  setContents: (contents: Content[]) => void
  setActiveContent: (content: Content | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPreviousUrl: (url: string | null) => void
  clearError: () => void
}

export const useContentStore = create<ContentState>((set) => ({
  contents: [],
  activeContent: null,
  isLoading: false,
  error: null,
  previousUrl: null,

  setContents: (contents) => set({ contents }),
  setActiveContent: (content) => set({ activeContent: content }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPreviousUrl(url) {
    set({ previousUrl: url })
  },
  clearError: () => set({ error: null })
}))
