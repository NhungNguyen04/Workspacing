import { auth, currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createTask, getTasks, updateTask, createTasks, updateTasks, deleteTask } from '@/services/taskService'

export async function POST(request: Request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let json;
    try {
      json = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError instanceof Error ? parseError.message : String(parseError));
      return new NextResponse('Invalid JSON in request body', { status: 400 });
    }
    
    // Check if the payload is null or undefined
    if (!json) {
      return new NextResponse('Request body is required', { status: 400 });
    }

    if (Array.isArray(json)) {
      const tasks = await createTasks(json, userId);
      return NextResponse.json(tasks);
    } else {
      // Pass userId only if teamspaceId is not provided
      const task = await createTask(json, json.columnId ? undefined : userId, json.columnId ? orgId : undefined);
      return NextResponse.json(task);
    }
  } catch (error) {
    console.error('Error creating task:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');

    const tasks = await getTasks(userId, boardId || undefined);
    return NextResponse.json(tasks || []);
  } catch (error) {
    console.error('Error fetching tasks:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    let json;
    try {
      json = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError instanceof Error ? parseError.message : String(parseError));
      return new NextResponse('Invalid JSON in request body', { status: 400 });
    }

    // Check if the payload is null or undefined
    if (!json) {
      return new NextResponse('Request body is required', { status: 400 });
    }

    if (!taskId) {
      // Handle bulk update
      if (Array.isArray(json)) {
        const tasks = await updateTasks(json);
        return NextResponse.json(tasks);
      }
      return new NextResponse('Task ID required', { status: 400 });
    }

    // Handle single task update
    const task = await updateTask(taskId, json);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const {searchParams} = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return new NextResponse('Task ID required', { status: 400 });
    }

    const task = await deleteTask(taskId);
    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error deleting task:', error instanceof Error ? error.message : String(error));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}