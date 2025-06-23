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
    
    const contentId = searchParams.get('contentId');

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!contentId) {
      return new NextResponse("Content ID is required", { status: 400 });
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
    }

    const taskContents = await taskContentService.getContentTasks(contentId);

    return NextResponse.json(taskContents);
  } catch (error) {
    console.error("[CONTENT_TASKS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
