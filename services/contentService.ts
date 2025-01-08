import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createContent = async (data: {
  title: string;
  content: string;
  userId: string;
  categoryIds?: string[];
}) => {
  const { categoryIds, ...contentData } = data;
  
  return prisma.content.create({
    data: {
      ...contentData,
      categories: {
        create: categoryIds?.map(categoryId => ({
          categoryId
        })) || []
      }
    },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
};

export const getContentByUserId = async (userId: string) => {
  return prisma.content.findMany({
    where: { userId },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const getContentById = async (id: string, userId: string) => {
  return prisma.content.findUnique({
    where: {
      id_userId: {
        id,
        userId
      }
    },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
};

export const updateContent = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    categoryIds?: string[];
  }
) => {
  const { categoryIds, ...updateData } = data;

  // Only include properties that are actually being updated
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  // If categoryIds is provided, update the categories
  if (categoryIds) {
    await prisma.contentCategory.deleteMany({
      where: { contentId: id }
    });

    if (categoryIds.length > 0) {
      await prisma.contentCategory.createMany({
        data: categoryIds.map(categoryId => ({
          contentId: id,
          categoryId
        }))
      });
    }
  }

  return prisma.content.update({
    where: { id_userId: { id, userId } },
    data: filteredUpdateData,
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
};

export const deleteContent = async (id: string, userId: string) => {
  return prisma.content.delete({
    where: { id_userId: { id, userId } }
  });
};

