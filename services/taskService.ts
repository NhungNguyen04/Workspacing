import { prisma } from '@/lib/prisma';
import { TaskInput, Task } from '@/types/task';

export async function createTask(data: TaskInput, userId: string) {
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

  return prisma.task.create({
    data: {
      ...data,
      repeat: data.repeat ?? '',
      category: data.category ?? '',
      columnId: data.columnId ?? null, // Ensure columnId can be null
      dueDate: data.dueDate ?? null, // Ensure dueDate can be null
      userId,
    },
  });
}

export async function createTasks(tasks: TaskInput[], userId: string) {
  const createdTasks = [];
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

    const createdTask = await prisma.task.create({
      data: {
        ...data,
        repeat: data.repeat ?? '',
        category: data.category ?? '',
        columnId: data.columnId ?? null,
        dueDate: data.dueDate ?? null,
        userId,
      },
    });
    createdTasks.push(createdTask);
  }
  return createdTasks;
}

export async function getTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
  });
}


export async function updateTask(data: Task, userId: string) {
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

  return prisma.task.update({
    where: { id: data.id },
    data: {
      ...data,
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
      },
    });
    updatedTasks.push(updatedTask);
  }
  return updatedTasks;
}