import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';
import * as taskContentService from '@/services/taskContentService';

export async function GET(
  req: Request
) {
  try {
    const { userId, orgId } = await auth();
    const { searchParams } = new URL(req.url);
    
    const taskId = searchParams.get('taskId');

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!taskId) {
      return new NextResponse("Task ID is required", { status: 400 });
    }

    // Verify that the task exists and belongs to the user or their teamspace
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        OR: [
          { userId },
          { teamspaceId: orgId || undefined }
        ]
      }
    });

    if (!task) {
      return new NextResponse("Task not found or unauthorized", { status: 404 });
    }

    const availableContents = await taskContentService.getAvailableContentsForTask(
      taskId,
      task.teamspaceId ? null : userId,
      task.teamspaceId
    );

    return NextResponse.json(availableContents);
  } catch (error) {
    console.error("[AVAILABLE_CONTENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
