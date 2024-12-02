import { NextRequest, NextResponse } from "next/server";
import * as boardService from "@/services/boardService";

export async function PUT(request: NextRequest, { params }: { params: { boardId: string } }) {
    const searchParams = request.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');
    const { boardId } = params;

    if (!teamspaceId || !boardId) {
        return NextResponse.json({ error: 'Missing teamspaceId or boardId' }, { status: 400 });
    }

    try {
        const { title } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Invalid board data' }, { status: 400 });
        }

        const updatedBoard = await boardService.updateBoard(teamspaceId, boardId, title);
        return NextResponse.json(updatedBoard);
    } catch (error) {
        console.error("Error updating board:", error);
        return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { boardId: string } }) {
    const searchParams = request.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');
    const { boardId } = params;

    if (!teamspaceId || !boardId) {
        return NextResponse.json({ error: 'Missing teamspaceId or boardId' }, { status: 400 });
    }

    try {
        const deletedBoard = await boardService.deleteBoard(teamspaceId, boardId);
        return NextResponse.json(deletedBoard);
    } catch (error) {
        console.error("Error deleting board:", error);
        return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
    }
}

