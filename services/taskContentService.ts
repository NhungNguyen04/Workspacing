import { prisma } from '@/lib/prisma';

export async function addContentToTask(taskId: string, contentId: string) {
  return prisma.taskContent.create({
    data: {
      taskId,
      contentId
    },
    include: {
      task: true,
      content: true
    }
  });
}

export async function removeContentFromTask(taskId: string, contentId: string) {
  return prisma.taskContent.delete({
    where: {
      taskId_contentId: {
        taskId,
        contentId
      }
    }
  });
}

export async function getTaskContents(taskId: string) {
  return prisma.taskContent.findMany({
    where: {
      taskId
    },
    include: {
      content: true
    }
  });
}

export async function getContentTasks(contentId: string) {
  return prisma.taskContent.findMany({
    where: {
      contentId
    },
    include: {
      task: true
    }
  });
}

export async function getAvailableContentsForTask(
  taskId: string, 
  userId?: string | null, 
  teamspaceId?: string | null
) {
  // First, find all content IDs that are already associated with the task
  const existingAssociations = await prisma.taskContent.findMany({
    where: { taskId },
    select: { contentId: true }
  });
  
  const existingContentIds = existingAssociations.map(assoc => assoc.contentId);
  
  // Then find all contents that are not yet associated with the task
  return await prisma.content.findMany({
    where: {
      AND: [
        { 
          OR: [
            { userId },
            { teamspaceId }
          ] 
        },
        {
          id: {
            notIn: existingContentIds.length > 0 ? existingContentIds : ['']
          }
        }
      ]
    }
  });
}
