import { NextResponse } from 'next/server';
import { generateBoard } from '@/services/aiService';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requirement = searchParams.get('requirement');

        if (!requirement) {
            return NextResponse.json(
                { error: 'Requirement is required' },
                { status: 400 }
            );
        }

        const boardData = await generateBoard(requirement);

        if (!boardData) {
            return NextResponse.json(
                { error: 'Failed to generate board' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: boardData });
        
    } catch (error) {
        console.error('Error generating board:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
