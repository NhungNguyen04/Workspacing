import { toggleStarBoard } from "@/services/boardService";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT (
  request: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { userId } = await auth();
  const { boardId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await toggleStarBoard(boardId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling star status:", error);
    return NextResponse.json({ error: 'Failed to toggle star status' }, { status: 500 });
  }
}