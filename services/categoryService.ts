import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategoriesByUserId = async (userId: string) => {
  try {
    return await prisma.category.findMany({
      where: { userId },
      include: {
        contents: {
          include: {
            content: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoriesByTeamspaceId = async (teamspaceId: string) => {
  try {
    return await prisma.category.findMany({
      where: { teamspaceId },
      include: {
        contents: {
          include: {
            content: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getContentsByCategory = async (categoryId: string) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
      },
      include: {
        contents: {
          include: {
            content: true
          }
        }
      }
    });
    return category?.contents.map(cc => cc.content) || [];
  } catch (error) {
    console.error('Error fetching contents by category:', error);
    throw new Error('Failed to fetch contents');
  }
};

export const createCategory = async (data: { name: string; color: string; userId?: string, teamspaceId?: string }) => {
  return prisma.category.create({
    data
  });
};

export const assignContentToCategory = async (contentId: string, categoryId: string) => {
  return prisma.contentCategory.create({
    data: {
      contentId,
      categoryId
    }
  });
};

export const deleteCategory = async (categoryId: string) => {
  try {
    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // First, delete all content-category relationships
      await tx.contentCategory.deleteMany({
        where: {
          categoryId
        }
      });

      // Then delete the category itself
      const deletedCategory = await tx.category.delete({
        where: {
          id: categoryId
        }
      });

      return deletedCategory;
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};