import { Column } from '@/types/column'
import { Task } from '@/types/task'

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks')
  if (!response.ok) throw new Error('Failed to fetch tasks')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function updateColumns(columns: Column[]) {
  return fetch('/api/columns', {
    method: 'PUT',
    body: JSON.stringify(columns),
  })
}

export async function updateTasks(tasks: Task[]) {
  return fetch('/api/tasks', {
    method: 'PUT',
    body: JSON.stringify(tasks),
  })
}

export async function createColumn(column: Partial<Column>) {
  const response = await fetch(`/api/columns`, {
    method: 'POST',
    body: JSON.stringify(column),
  })
  return response.json()
}

export async function createTask(task: Partial<Task>) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
  return response.json()
}
