import { PrismaClient } from '@prisma/client';
import { Content } from '../types/content';

const prisma = new PrismaClient();

export async function getUserContents(userId: string): Promise<Content[]> {
  return prisma.content.findMany({
    where: { userId },
  });
}

export async function createContent(userId: string, title: string): Promise<Content> {
  return prisma.content.create({
    data: {
      title,
      content: '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getContentById(userId: string, id: string): Promise<Content | null> {
  return prisma.content.findUnique({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
  });
}

export async function updateContent(userId: string, id: string, title: string, content: string): Promise<Content> {
  return prisma.content.update({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
    data: {
      title,
      content,
      updatedAt: new Date(),
    },
  });
}

export async function deleteContent(userId: string, id: string): Promise<Content> {
  return prisma.content.delete({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
  });
}
