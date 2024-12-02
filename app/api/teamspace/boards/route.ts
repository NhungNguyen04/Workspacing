import { NextRequest, NextResponse } from "next/server";
import * as boardService from "@/services/boardService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');

    if (!teamspaceId) {
        return NextResponse.json({ error: 'Missing teamspaceId' }, { status: 400 });
    }

    try {
        const boards = await boardService.getTeamspaceBoards(teamspaceId);
        return NextResponse.json(boards);
    } catch (error) {
        console.error("Error fetching boards:", error);
        return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');

    if (!teamspaceId) {
        return NextResponse.json({ error: 'Missing teamspaceId' }, { status: 400 });
    }

    try {
        const { title, color } = await request.json();
        if (!title || !color) {
            return NextResponse.json({ error: 'Invalid board data' }, { status: 400 });
        }

        const newBoard = await boardService.createBoard(teamspaceId, title, color);
        return NextResponse.json(newBoard);
    } catch (error) {
        console.error("Error creating board:", error);
        return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
    }
}

