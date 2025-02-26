import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createContent = async (data: {
  title: string;
  content: string;
  userId?: string;
  teamspaceId?: string;
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
      },
      tasks: {
        include: {
          task: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const getContentByTeamspaceId = async (teamspaceId: string) => {
  return prisma.content.findMany({
    where: { teamspaceId },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      tasks: {
        include: {
          task: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

export const getContentById = async (id: string) => {
  return prisma.content.findUnique({
    where: {
      id
    },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      tasks: {
        include: {
          task: true
        }
      }
    }
  });
};

export const updateContent = async (
  id: string,
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
    where: { id },
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

export const deleteContent = async (id: string) => {
  return prisma.content.delete({
    where: { id }
  });
};

