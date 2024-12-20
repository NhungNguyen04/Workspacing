import { PrismaClient } from '@prisma/client';
import { Board } from '@/types/board';

const prisma = new PrismaClient();

export async function getTeamspaceBoards(teamspaceId: string): Promise<Board[]> {
  return prisma.board.findMany({
    where: { teamspaceId },
  });
}

export async function createBoard(teamspaceId: string, title: string, color: string): Promise<Board> {
  return prisma.board.create({
    data: {
      title,
      teamspaceId,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getBoardById(id: string): Promise<Board | null> {
  return prisma.board.findUnique({
    where: {
      id,
    },
  });
}

export async function updateBoard(id: string, title: string): Promise<Board> {
  return prisma.board.update({
    where: { id },
    data: {
      title,
      updatedAt: new Date(),
    },
  });
}

export async function deleteBoard(id: string): Promise<Board> {
  return prisma.board.delete({
    where: {id},
  });
}
