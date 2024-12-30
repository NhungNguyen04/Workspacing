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
  moveTask: (taskId: string, sourceColId: string, destColId: string, newIndex: number) => void
  moveColumn: (columnId: string, newIndex: number) => void
  optimisticAddColumn: (column: Column) => void
  updateColumnById: (columnId: string, updatedColumn: Column) => void
  updateColumn: (columnId: string, updates: Partial<Column>) => void
  removeColumn: (columnId: string, restoreColumn?: Column) => void
  removeTask: (taskId: string) => void
  restoreTask: (task: Task) => void
  updateTaskTitle: (taskId: string, newTitle: string) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
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
  moveTask: (taskId: string, sourceColId: string, destColId: string, newIndex: number) => set((state) => {
    const newColumns = [...state.columns];
    const sourceCol = newColumns.find(col => col.id === sourceColId);
    const destCol = newColumns.find(col => col.id === destColId);
    
    if (!sourceCol || !destCol) return state;

    const taskToMove = sourceCol.tasks?.find(task => task.id === taskId);
    if (!taskToMove) return state;

    // Remove from source
    sourceCol.tasks = sourceCol.tasks?.filter(task => task.id !== taskId);
    
    // Add to destination
    if (!destCol.tasks) destCol.tasks = [];
    destCol.tasks = [
      ...(destCol.tasks?.slice(0, newIndex) || []),
      taskToMove,
      ...(destCol.tasks?.slice(newIndex) || [])
    ];

    return { columns: newColumns };
  }),

  moveColumn: (columnId: string, newIndex: number) => set((state) => {
    const columns = [...state.columns];
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (columnIndex === -1) return state;
    
    const [removed] = columns.splice(columnIndex, 1);
    columns.splice(newIndex, 0, removed);
    
    return { columns };
  }),

  optimisticAddColumn: (column) => set((state) => ({
    columns: [...state.columns, column]
  })),

  updateColumnById: (columnId, updatedColumn) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === columnId ? updatedColumn : col
    )
  })),

  updateColumn: (columnId, updates) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    )
  })),

  removeColumn: (columnId: string, restoreColumn?: Column) => 
    set((state) => ({
        columns: restoreColumn 
            ? [...state.columns, restoreColumn]
            : state.columns.filter((col) => col.id !== columnId)
    })),

  removeTask: (taskId: string) => set((state) => ({
    columns: state.columns.map(col => ({
      ...col,
      tasks: col.tasks?.filter(task => task.id !== taskId)
    }))
  })),

  restoreTask: (task: Task) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === task.columnId
        ? { ...col, tasks: [...(col.tasks || []), task] }
        : col
    )
  })),

  updateTaskTitle: (taskId: string, newTitle: string) => set((state) => ({
    columns: state.columns.map(col => ({
      ...col,
      tasks: col.tasks?.map(task => 
        task.id === taskId 
          ? { ...task, title: newTitle }
          : task
      )
    }))
  })),
}))
