import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getTeamspaceBoards, createBoard } from '@/services/boardService';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ teamspaceId: string }> }
  ) {
    try {
    const { teamspaceId } = await context.params;
      const teamspaceBoards = await getTeamspaceBoards(teamspaceId);
      return NextResponse.json(teamspaceBoards);
    } catch (error) {
      console.error('Error fetching contents:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  export async function POST(
    request: NextRequest,
    context: { params: Promise<{ teamspaceId: string }> }
  ) {
    try {
    const { teamspaceId } = await context.params;
      if (!teamspaceId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const { title, color } = await request.json();
      const newBoard = await createBoard(teamspaceId, title, color);
      return NextResponse.json(newBoard);
    } catch (error) {
      console.error('Error creating content:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }