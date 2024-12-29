import { prisma } from '@/lib/prisma';
import { TaskInput, Task } from '@/types/task';

export async function createTask(data: TaskInput, userId: string) {
  const { columnId, ...restData } = data;
  
  if (!columnId) {
    throw new Error('Column ID is required');
  }

  return prisma.task.create({
    data: {
      ...restData,
      userId,
      column: { connect: { id: columnId } },
      repeat: restData.repeat || '',
      category: restData.category || '',
      position: data.position ?? 0
    }
  });
}

export async function createTasks(tasks: TaskInput[], userId: string) {
  const createdTasks = [];
  for (const data of tasks) {
    if (data.dueDate && data.dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    const columnId = data.columnId || null;
    const { position, ...restData } = data;

    const createdTask = await prisma.task.create({
      data: {
        ...restData,
        repeat: restData.repeat || '',
        category: restData.category || '',
        column: columnId ? { connect: { id: columnId } } : undefined,
        columnId: undefined,
        dueDate: restData.dueDate || null,
        position: position ?? undefined, // Only include position if it has a value
        userId,
      },
    });
    createdTasks.push(createdTask);
  }
  return createdTasks;
}

export async function getTasks(userId: string, boardId: string) {
  return prisma.task.findMany({
    where: {
      userId,
      column: {
        boardId
      }
    },
    orderBy: [
      {
        columnId: 'asc'
      },
      {
        position: 'asc'
      }
    ]
  });
}

export async function updateTask(data: Task, userId: string) {
  if (data.dueDate && data.dueDate < new Date()) {
    throw new Error('Due date cannot be in the past');
  }

  const columnId = data.columnId || null;

  return prisma.task.update({
    where: { id: data.id },
    data: {
      ...data,
      repeat: data.repeat || '',  // Ensure repeat is never null
      category: data.category || '',
      column: columnId ? { connect: { id: columnId } } : undefined,
      columnId: undefined, // Remove columnId from direct assignment
      dueDate: data.dueDate || null,
    },
  });
}

export async function updateTasks(tasks: Task[], userId: string) {
  const updatedTasks = [];
  for (const data of tasks) {
    if (data.dueDate && data.dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
    if (data.columnId) {
      const columnExists = await prisma.column.findUnique({
        where: { id: data.columnId },
      });
      if (!columnExists) {
        throw new Error('Invalid columnId');
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: data.id },
      data: {
        ...data,
        repeat: data.repeat || '',  // Ensure repeat is never null
        category: data.category || '',
        dueDate: data.dueDate || null,
      },
    });
    updatedTasks.push(updatedTask);
  }
  return updatedTasks;
}