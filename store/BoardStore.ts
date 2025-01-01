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
  tasksByColumn: Record<string, Task[]>
  
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
  bulkAddColumns: (columns: Column[]) => void
  bulkAddTasks: (tasks: Task[]) => void
  hydratePreviousUrl: () => void
  createTask: (columnId: string, task: Omit<Task, 'id' | 'columnId'>) => Task
  updateTaskWithColumn: (taskId: string, updates: Partial<Task>, newColumnId?: string) => void
  getTaskWithColumn: (taskId: string) => { task: Task | null, columnName: string | null }
  deleteTaskFromColumn: (taskId: string, columnId: string) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  activeBoard: null,
  isLoading: false,
  error: null,
  previousUrl: null,
  columns: [],
  tasks: [],
  tasksByColumn: {},
  
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setPreviousUrl(url) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('previousUrl', url || '');
    }
    set({ previousUrl: url });
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

  bulkAddColumns: (newColumns: Column[]) => 
    set((state) => ({
      columns: [...state.columns, ...newColumns]
    })),
    
  bulkAddTasks: (newTasks: Task[]) =>
    set((state) => ({
      tasks: [...state.tasks, ...newTasks]
    })),

  hydratePreviousUrl: () => {
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('previousUrl');
      set({ previousUrl: storedUrl });
    }
  },

  createTask: (columnId, taskData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      columnId,
      ...taskData
    };

    set((state) => ({
      columns: state.columns.map(col => 
        col.id === columnId
          ? { ...col, tasks: [...(col.tasks || []), newTask] }
          : col
      )
    }));

    return newTask;
  },

  updateTaskWithColumn: (taskId, updates, newColumnId) => set((state) => {
    let updatedColumns = [...state.columns];
    
    // Find the task and its current column
    let currentColumnIndex = -1;
    let taskIndex = -1;
    
    updatedColumns.forEach((col, colIndex) => {
      const tIndex = col.tasks?.findIndex(t => t.id === taskId) ?? -1;
      if (tIndex !== -1) {
        currentColumnIndex = colIndex;
        taskIndex = tIndex;
      }
    });

    if (currentColumnIndex === -1 || taskIndex === -1) return state;

    const currentColumn = updatedColumns[currentColumnIndex];
    const task = currentColumn.tasks![taskIndex];
    
    if (newColumnId && newColumnId !== task.columnId) {
      // Remove from current column
      currentColumn.tasks = currentColumn.tasks!.filter(t => t.id !== taskId);
      
      // Add to new column
      const newColumn = updatedColumns.find(col => col.id === newColumnId);
      if (newColumn) {
        const updatedTask = { ...task, ...updates, columnId: newColumnId };
        newColumn.tasks = [...(newColumn.tasks || []), updatedTask];
      }
    } else {
      // Update in current column
      currentColumn.tasks![taskIndex] = { ...task, ...updates };
    }

    return { columns: updatedColumns };
  }),

  getTaskWithColumn: (taskId) => {
    const state = get();
    for (const column of state.columns) {
      const task = column.tasks?.find(t => t.id === taskId);
      if (task) {
        return { task, columnName: column.title };
      }
    }
    return { task: null, columnName: null };
  },

  deleteTaskFromColumn: (taskId, columnId) => set((state) => ({
    columns: state.columns.map(col => 
      col.id === columnId
        ? { ...col, tasks: col.tasks?.filter(task => task.id !== taskId) }
        : col
    )
  })),

  updateTask: (taskId, updates) => set((state) => ({
    columns: state.columns.map(col => ({
      ...col,
      tasks: col.tasks?.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      )
    }))
  })),

}));
