import { NextRequest, NextResponse } from "next/server";
import * as columnService from "@/services/columnService";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    const { userId } = await auth();
      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    
      const json = await request.json();
      if (Array.isArray(json)) {
        const columns = await columnService.createColumns(json);
        return NextResponse.json(columns);
      } else {
        const column = await columnService.createColumn(json);
        return NextResponse.json(column);
      }
    }

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const columnId = searchParams.get('columnId');

    if (!columnId) {
        return NextResponse.json({ error: 'Missing columnId' }, { status: 400 });
    }

    try {
        const column = await columnService.getColumnById(columnId);
        return NextResponse.json(column);
    } catch (error) {
        console.error("Error getting column:", error);
        return NextResponse.json({ error: 'Failed to get column' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const data = await request.json();
        
        // Handle bulk update
        if (Array.isArray(data)) {
            const updatedColumns = await columnService.updateColumns(data);
            return NextResponse.json(updatedColumns);
        }
        
        // Handle single column update
        const columnId = request.nextUrl.searchParams.get('columnId');
        if (!columnId) {
            return NextResponse.json({ error: 'Missing columnId' }, { status: 400 });
        }
        const updatedColumn = await columnService.updateColumn(columnId, data);
        return NextResponse.json(updatedColumn);
    } catch (error) {
        console.error("Error updating column(s):", error);
        return NextResponse.json({ error: 'Failed to update column(s)' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {

    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const columnId = request.nextUrl.searchParams.get('columnId');
    if (!columnId) {
        return NextResponse.json({ error: 'Missing columnId' }, { status: 400 });
    }
    try {
        await columnService.deleteColumn(columnId);
        return NextResponse.json({ message: 'Column deleted' });
    } catch (error) {
        console.error("Error deleting column:", error);
        return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 });
    }
}