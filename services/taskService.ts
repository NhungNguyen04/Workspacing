import { prisma } from '@/lib/prisma';
import { TaskInput } from '@/types/task';

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

export async function getTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
  });
}

