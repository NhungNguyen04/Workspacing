import { PrismaClient } from '@prisma/client';
import { Column } from '@/types/column';

const prisma = new PrismaClient();

export async function createColumn(data: Column, boardId: string) : Promise<Column> {
  return prisma.column.create({
    data: {
      ...data,
      boardId,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: {
        create: []
      }
    }
  })
}

export async function createColumns(columns: Column[], boardId: string) : Promise<Column[]> {
    const createdColumns = [];
    for (const data of columns) {
        const createdColumn = await prisma.column.create({
        data: {
            ...data,
            boardId,
            createdAt: new Date(),
            updatedAt: new Date(),
            tasks: {
            create: []
            }
        }
        });
        createdColumns.push(createdColumn);
    }
    return createdColumns;
}

export async function getColumnById(id: string): Promise<Column | null> {
  return prisma.column.findUnique({
    where: {
      id,
    },
  });
}

export async function updateColumn(id: string, data: any) : Promise<Column> {
    return prisma.column.update({
        where: {id},
        data: {
            ...data
        }
    })
}

export async function updateColumns(columns: Column[]) : Promise<Column[]> {
    const updatedColumns = [];
    for (const data of columns) {
        const updatedColumn = await prisma.column.update({
        where: {id: data.id},
        data: {
            ...data
        }
        });
        updatedColumns.push(updatedColumn);
    }
    return updatedColumns;
}

export async function deleteColumn(id: string): Promise<Column> {
  return prisma.column.delete({
    where: {id},
  });
}