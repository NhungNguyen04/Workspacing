import { PrismaClient } from '@prisma/client';
import { Column } from '@/types/column';
import { Task } from '@/types/task';

const prisma = new PrismaClient();

export async function createColumn(data: Column) : Promise<Column> {
  return prisma.column.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: {
        create: []
      }
    }
  })
}

export async function createColumns(columns: Column[]) : Promise<Column[]> {
    const createdColumns = [];
    for (const data of columns) {
        const createdColumn = await prisma.column.create({
        data: {
            ...data,
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

export async function updateColumns(columns: Column[]): Promise<Column[]> {
    const updatedColumns = await prisma.$transaction(
        columns.map(column => 
            prisma.column.update({
                where: { 
                    id: column.id,
                },
                data: {
                    position: column.position,
                    updatedAt: new Date()
                },
                include: {
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            status: true,
                            reminder: true,
                            repeat: true,
                            category: true,
                            userId: true,
                            columnId: true,
                            createdAt: true,
                            updatedAt: true,
                            description: true,
                            dueDate: true
                        }
                    }
                }
            })
        )
    );

    return updatedColumns as unknown as Column[];
}

export async function deleteColumn(id: string): Promise<Column> {
  return prisma.column.delete({
    where: {id},
  });
}

export async function fetchColumnsByBoardandOrg (boardId: string, orgId: string): Promise<Column[]> {
  const columns = await prisma.column.findMany({
    where: {
      boardId: boardId,
      board: {
        teamspaceId: orgId,
      },
    },
    include: {
      tasks: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  });
  if (!columns) {
    return [];
  }
  return columns as unknown as Column[];
}