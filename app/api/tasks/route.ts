import { auth, currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createTask, getTasks, updateTask, createTasks, updateTasks } from '@/services/taskService'

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

  const json = await request.json();
  if (Array.isArray(json)) {
    const tasks = await updateTasks(json, userId);
    return NextResponse.json(tasks);
  } else {
    const task = await updateTask(json, userId);
    return NextResponse.json(task);
  }
}