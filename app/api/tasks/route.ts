import { auth, currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createTask, getTasks, updateTask, createTasks, updateTasks, deleteTask } from '@/services/taskService'

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  if (Array.isArray(json)) {
    const tasks = await createTasks(json, userId);
    return NextResponse.json(tasks);
  } else {
    const task = await createTask(json, userId);
    return NextResponse.json(task);
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return new NextResponse('Board ID required', { status: 400 });
  }

  const tasks = await getTasks(userId, boardId);
  return NextResponse.json(tasks);
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const json = await request.json();

  if (!taskId) {
    // Handle bulk update
    if (Array.isArray(json)) {
      const tasks = await updateTasks(json, userId);
      return NextResponse.json(tasks);
    }
    return new NextResponse('Task ID required', { status: 400 });
  }

  // Handle single task update
  const task = await updateTask(taskId, json);
  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
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
}