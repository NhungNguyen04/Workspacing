import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';
import * as taskContentService from '@/services/taskContentService';

export async function POST(
  req: Request
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId, contentId } = await req.json();

    if (!taskId || !contentId) {
      return new NextResponse("Task ID and Content ID are required", { status: 400 });
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

    // Verify that the content exists and belongs to the user or their teamspace
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        OR: [
          { userId },
          { teamspaceId: orgId || undefined }
        ]
      }
    });

    if (!content) {
      return new NextResponse("Content not found or unauthorized", { status: 404 });
    }    // Create the relationship
    const taskContent = await taskContentService.addContentToTask(taskId, contentId);

    return NextResponse.json(taskContent);
  } catch (error) {
    console.error("[TASK_CONTENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId, contentId } = await req.json();

    if (!taskId || !contentId) {
      return new NextResponse("Task ID and Content ID are required", { status: 400 });
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
    }    // Delete the relationship
    await taskContentService.removeContentFromTask(taskId, contentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TASK_CONTENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    }    const taskContents = await taskContentService.getTaskContents(taskId);

    return NextResponse.json(taskContents);
  } catch (error) {
    console.error("[TASK_CONTENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
