import { create } from 'zustand'
import { Board } from '@/types/board'
import { Column } from '@/types/column'
import { Task } from '@/types/task'

interface BoardState {
  boards: Board[]
  activeBoard: Board | null
  isLoading: boolean
  error: string | null
  previousUrl: string | null
  columns: Column[]
  tasks: Task[]
  
  setBoards: (boards: Board[]) => void
  setActiveBoard: (board: Board | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPreviousUrl: (url: string | null) => void
  clearError: () => void
  setColumns: (columns: Column[]) => void
  setTasks: (tasks: Task[]) => void
  addColumn: (column: Column) => void
  addTask: (task: Task) => void
  updateColumnOrder: (columns: Column[]) => void
  updateTaskOrder: (tasks: Task[]) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  isLoading: false,
  error: null,
  previousUrl: null,
  columns: [],
  tasks: [],
  
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPreviousUrl(url) {
    set({ previousUrl: url })
  },
  clearError: () => set({ error: null }),
  setColumns: (columns) => set({ columns }),
  setTasks: (tasks) => set({ tasks }),
  addColumn: (column) => set((state) => ({ 
    columns: [...state.columns, column] 
  })),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  updateColumnOrder: (columns) => set({ columns }),
  updateTaskOrder: (tasks) => set({ tasks }),
}))
