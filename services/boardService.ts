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

export async function getBoardById(teamspaceId: string, id: string): Promise<Board | null> {
  return prisma.board.findUnique({
    where: {
      id_teamspaceId: {
        id,
        teamspaceId,
      },
    },
  });
}

export async function updateBoard(teamspaceId: string, id: string, title: string): Promise<Board> {
  return prisma.board.update({
    where: {
      id_teamspaceId: {
        id,
        teamspaceId,
      },
    },
    data: {
      title,
      teamspaceId,
      updatedAt: new Date(),
    },
  });
}

export async function deleteBoard(teamspaceId: string, id: string): Promise<Board> {
  return prisma.board.delete({
    where: {
      id_teamspaceId: {
        id,
        teamspaceId,
      },
    },
  });
}
