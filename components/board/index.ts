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
    const error = await response.text();
    throw new Error(`Failed to create column: ${error}`);
  }

  return response.json();
}

export async function createTask(task: Partial<Task>) {
  const response = await fetch(`/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create task: ${error}`);
  }

  return response.json();
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

interface BoardColumn {
  title: string;
  tasks: string[];
}

interface BoardData {
  columns: BoardColumn[];
}

export async function generateBoardFromAI(requirement: string) {
  const response = await fetch(`/api/ai?requirement=${encodeURIComponent(requirement)}`);
  
  if (!response.ok) {
    throw new Error('Failed to generate board from AI');
  }
  
  const rawData = await response.json();
  
  try {
    // Extract JSON content from markdown code block if present
    let jsonString = rawData.data || rawData;
    if (typeof jsonString === 'string') {
      // Remove markdown code block syntax if present
      jsonString = jsonString.replace(/^```json\n|\n```$/g, '');
    }

    // Parse the JSON string
    const parsedData = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

    // Validate the structure
    if (!parsedData || !Array.isArray(parsedData.columns)) {
      throw new Error('Invalid board data structure');
    }

    return parsedData;
  } catch (error) {
    console.error('Parsing error:', error);
    console.error('Raw data:', rawData);
    throw new Error('Failed to parse AI response');
  }
}

export async function applyAIGeneratedBoard(boardId: string, aiData: BoardData) {
  // Create columns
  const createdColumns = await Promise.all(
    aiData.columns.map((columnData, index) =>
      createColumn({
        title: columnData.title,
        boardId: boardId,
        position: index
      })
    )
  );

  // Create tasks for each column
  await Promise.all(
    createdColumns.map((column, colIndex) =>
      Promise.all(
        aiData.columns[colIndex].tasks.map((taskTitle, taskIndex) =>
          createTask({
            title: taskTitle,
            columnId: column.id,
            position: taskIndex,
            status: "in-progress",
            reminder: false,
            repeat: "",
            category: "",
            userId: "null"
          })
        )
      )
    )
  );

  return { success: true };
}