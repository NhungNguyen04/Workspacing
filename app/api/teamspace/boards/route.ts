import { NextRequest, NextResponse } from "next/server";
import * as boardService from "@/services/boardService";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const teamspaceId = searchParams.get('teamspaceId');

        if (!teamspaceId) {
            return NextResponse.json({ 
                data: { boards: [] }, 
                error: 'Missing teamspaceId' 
            });
        }

        const boards = await boardService.getTeamspaceBoards(teamspaceId);
        return NextResponse.json({ 
            data: { boards },
            error: null 
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ 
            data: { boards: [] }, 
            error: 'Internal server error' 
        }, { 
            status: 500 
        });
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');

    if (!teamspaceId) {
        return NextResponse.json(
            { data: null, error: 'Missing teamspaceId' }, 
            { status: 400 }
        );
    }

    try {
        const data = await request.json();
        
        if (!data.title || !data.color) {
            return NextResponse.json(
                { data: null, error: 'Title and color are required' }, 
                { status: 400 }
            );
        }

        const newBoard = await boardService.createBoard({
            title: data.title,
            teamspaceId,
            color: data.color,
            imageThumbUrl: data.imageThumbUrl || "",
            imageFullUrl: data.imageFullUrl || "",
        });

        return NextResponse.json({ data: newBoard, error: null });
    } catch (error) {
        console.error("Error creating board:", error);
        return NextResponse.json(
            { data: null, error: 'Failed to create board' }, 
            { status: 500 }
        );
    }
}

