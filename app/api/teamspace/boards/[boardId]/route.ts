import { NextRequest, NextResponse } from "next/server";
import * as boardService from "@/services/boardService";

export async function PUT(request: NextRequest, context: { params: Promise<{ boardId: string }>}) {
    const { boardId } = await context.params;

    if ( !boardId) {
        return NextResponse.json({ error: 'Missing teamspaceId or boardId' }, { status: 400 });
    }

    try {
        const { title } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Invalid board data' }, { status: 400 });
        }

        const updatedBoard = await boardService.updateBoard(boardId, title);
        return NextResponse.json(updatedBoard);
    } catch (error) {
        console.error("Error updating board:", error);
        return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ boardId: string }>}) {
    const { boardId } = await context.params;

    if (!boardId) {
        return NextResponse.json({ error: 'Missing teamspaceId or boardId' }, { status: 400 });
    }

    try {
        const deletedBoard = await boardService.deleteBoard(boardId);
        return NextResponse.json(deletedBoard);
    } catch (error) {
        console.error("Error deleting board:", error);
        return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
    }
}


export async function GET(request: NextRequest, context: {params: Promise<{boardId: string}>}) {
    const { boardId } = await context.params;

    if (!boardId) {
        return NextResponse.json({ error: 'Missing teamspaceId or boardId' }, { status: 400 });
    }

    try {
        const board = await boardService.getBoardById(boardId);
        if (!board) {
            return NextResponse.json({ message: 'Board not found' }, { status: 404 });
        }
        return NextResponse.json(board);
    } catch (error) {
        console.error('Error fetching board:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

}
