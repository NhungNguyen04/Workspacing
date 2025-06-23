import { create } from 'zustand'
import { Content } from '@/types/content'
import { Category } from '@/types/category'

interface TeamspaceContentState {
  contents: Content[]
  categories: Category[]
  activeContent: Content | null
  activeCategory: Category | null
  isLoading: boolean
  error: string | null
  previousUrl: string | null
  contentsLoaded: boolean
  categoriesLoaded: boolean
  currentTeamspaceId: string | null
  
  setContents: (contents: Content[]) => void
  setCategories: (categories: Category[]) => void
  setActiveContent: (content: Content | null) => void
  setActiveCategory: (category: Category | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPreviousUrl: (url: string | null) => void
  clearError: () => void
  setContentsLoaded: (loaded: boolean) => void
  setCategoriesLoaded: (loaded: boolean) => void
  setCurrentTeamspaceId: (teamspaceId: string | null) => void
  resetStore: () => void
}

export const useTeamspaceContentStore = create<TeamspaceContentState>((set) => ({
  contents: [],
  categories: [],
  activeContent: null,
  activeCategory: null,
  isLoading: false,
  error: null,
  previousUrl: null,
  contentsLoaded: false,
  categoriesLoaded: false,
  currentTeamspaceId: null,

  setContents: (contents) => set({ contents, contentsLoaded: true }),
  setCategories: (categories) => set({ categories, categoriesLoaded: true }),
  setActiveContent: (content) => set({ activeContent: content }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPreviousUrl: (url) => set({ previousUrl: url }),
  clearError: () => set({ error: null }),
  setContentsLoaded: (loaded) => set({ contentsLoaded: loaded }),
  setCategoriesLoaded: (loaded) => set({ categoriesLoaded: loaded }),
  setCurrentTeamspaceId: (teamspaceId) => set({ currentTeamspaceId: teamspaceId }),
  resetStore: () => set({
    contents: [],
    categories: [],
    activeContent: null,
    activeCategory: null,
    contentsLoaded: false,
    categoriesLoaded: false,
    error: null
  })
}))
