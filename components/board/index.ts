import { Column } from '@/types/column'
import { Task } from '@/types/task'
import { useBoardStore } from '@/store/BoardStore'

export async function updateBoardTitle(boardId: string, newTitle: string) {
  const response = await fetch(`/api/teamspace/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify ({
      title: newTitle
    })
  })
  if (!response.ok) throw new Error('Failed to update board title')
  return response.json;
}

export async function fetchTasks(boardId: string): Promise<Task[]> {
  const response = await fetch(`/api/tasks?boardId=${boardId}`)
  if (!response.ok) throw new Error('Failed to fetch tasks')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function updateColumns(columns: Column[]) {
  const response = await fetch('/api/columns', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      columns.map(({ id, position, boardId }) => ({
        id,
        position,
        boardId
      }))
    ),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update columns');
  }
  
  return response.json();
}

export async function updateTasks(tasks: Task[]) {
  return fetch('/api/tasks', {
    method: 'PUT',
    body: JSON.stringify(tasks),
  })
}

export async function createColumn(column: Partial<Column>) {
  const response = await fetch('/api/columns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(column),
  });

  if (!response.ok) {
    throw new Error('Failed to create column');
  }

  const data = await response.json();
  return data;
}

export async function createTask(task: Partial<Task>) {
  const response = await fetch(`/api/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
  })
  return response.json()
}

export async function updateColumnTitle(columnId: string, newTitle: string) {
  const response = await fetch(`/api/columns?columnId=${columnId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newTitle })
  });

  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

export async function deleteColumn(columnId: string) {
  const response = await fetch(`/api/columns?columnId=${columnId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete column');
  }
  return response.json();
}

export async function deleteTask(taskId: string) {
  const response = await fetch(`/api/tasks?taskId=${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
}

export async function updateTaskTitle(taskId: string, newTitle: string) {
  const response = await fetch(`/api/tasks?taskId=${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle })
  });

  if (!response.ok) {
    throw new Error('Failed to update task title');
  }
  return response.json();
}