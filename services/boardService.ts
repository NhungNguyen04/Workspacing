import { PrismaClient } from '@prisma/client';
import { Board } from '@/types/board';

const prisma = new PrismaClient();

interface CreateBoardData {
  title: string;
  teamspaceId: string;
  color: string;
  imageThumbUrl?: string;
  imageFullUrl?: string;
}

export async function getTeamspaceBoards(teamspaceId: string): Promise<Board[]> {
  if (!teamspaceId) {
    return [];
  }

  try {
    const boards = await prisma.board.findMany({
      where: { teamspaceId }
    });

    return boards.map(board => ({
      ...board,
      imageThumbUrl: board.imageThumbUrl || '',
      imageFullUrl: board.imageFullUrl || ''
    }));
  } catch (error) {
    console.error("Database error:", error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function createBoard(data: CreateBoardData): Promise<Board> {
  return await prisma.board.create({
    data: {
      title: data.title,
      teamspaceId: data.teamspaceId,
      color: data.color,
      imageThumbUrl: data.imageThumbUrl ?? "",
      imageFullUrl: data.imageFullUrl ?? "",
    },
    include: {
      columns: true
    }
  }) as Board;
}

export async function getBoardById(id: string): Promise<Board | null> {
  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      columns: true
    }
  });

  if (!board) return null;

  // Convert null values to empty strings
  return {
    ...board,
    imageThumbUrl: board.imageThumbUrl || "",
    imageFullUrl: board.imageFullUrl || "",
  } as Board;
}

export async function updateBoard(id: string, title: string): Promise<Board> {
  const board = await prisma.board.update({
    where: { id },
    data: {
      title,
      updatedAt: new Date(),
    },
    include: {
      columns: true
    }
  });

  return {
    ...board,
    imageThumbUrl: board.imageThumbUrl || "",
    imageFullUrl: board.imageFullUrl || "",
  } as Board;
}

export async function deleteBoard(id: string): Promise<Board> {
  // First delete all tasks associated with all columns of this board
  await prisma.task.deleteMany({
    where: {
      column: {
        boardId: id
      }
    }
  });

  // Then delete all columns associated with this board
  await prisma.column.deleteMany({
    where: {
      boardId: id
    }
  });

  const board = await prisma.board.delete({
    where: { id },
    include: {
      columns: true
    }
  });

  return {
    ...board,
    imageThumbUrl: board.imageThumbUrl || "",
    imageFullUrl: board.imageFullUrl || "",
  } as Board;
}

