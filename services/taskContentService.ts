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
