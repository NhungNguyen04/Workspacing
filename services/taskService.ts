import { prisma } from '@/lib/prisma';
import { Task } from '@/types/task';

export async function createTask(data: Task, userId?: string, teamspaceId?: string) {

  if (!data.columnId && !data.userId) {
    throw new Error('Column ID or userId is required');
  }

  return prisma.task.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      repeat: data.repeat || '',
      category: data.category || '',
      position: data.position ?? 0,
      columnId: data.columnId ?? null,
      userId: userId || null,
      teamspaceId: teamspaceId ?? null,
    }
  });
}

export async function createTasks(tasks: Task[], userId?: string, teamspaceId?: string) {
  const createdTasks = [];
  for (const data of tasks) {
    if (data.dueDate && data.dueDate < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    const { columnId, position, ...restData } = data;

    const createdTask = await prisma.task.create({
      data: {
        ...restData,
        ...(teamspaceId ? { teamspaceId } : { userId }),
        repeat: restData.repeat || '',
        category: restData.category || '',
        column: columnId ? { connect: { id: columnId } } : undefined,
        columnId: undefined,
        dueDate: restData.dueDate || null,
        position: position ?? undefined,
      },
    });
    createdTasks.push(createdTask);
  }
  return createdTasks;
}

export async function getTasks(userId: string, boardId?: string) {
  const whereClause: any = {
    OR: [
      { userId: userId },
      { AND: [
        { teamspaceId: { not: null } }
      ]}
    ]
  };
  
  if (boardId) {
    whereClause.column = { boardId };
  }

  return prisma.task.findMany({
    where: whereClause,
    orderBy: [
      { columnId: 'asc' },
      { position: 'asc' }
    ]
  });
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  if (data.dueDate && data.dueDate < new Date()) {
    throw new Error('Due date cannot be in the past');
  }

  return prisma.task.update({
    where: { 
      id: taskId 
    },
    data: {
      ...data,
      repeat: data.repeat || '',
      category: data.category || '',
      dueDate: data.dueDate || null,
    },
  });
}

export async function updateTasks(tasks: Task[]) {
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

export async function deleteTask(taskId: string) {
  return prisma.task.delete({
    where: { id: taskId },
  });
}