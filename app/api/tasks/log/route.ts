import {auth} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getLogByEntityId } from '@/services/auditLogService';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
        }
    
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('taskId');
    
        const logs = await getLogByEntityId(taskId || '');
        return NextResponse.json(logs || []);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}