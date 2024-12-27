import { create } from 'zustand'
import { Board } from '@/types/board'

interface BoardState {
  boards: Board[]
  activeBoard: Board | null
  isLoading: boolean
  error: string | null
  previousUrl: string| null
  
  setBoards: (boards: Board[]) => void
  setActiveBoard: (board: Board | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPreviousUrl: (url: string | null) => void
  clearError: () => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  isLoading: false,
  error: null,
  previousUrl: null,

  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPreviousUrl(url) {
    set({ previousUrl: url })
  },
  clearError: () => set({ error: null })
}))
