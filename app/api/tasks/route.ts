import { auth, currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createTask, getTasks } from '@/services/taskService'

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const json = await request.json();
  const task = await createTask(json, userId);

  return NextResponse.json(task);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tasks = await getTasks(userId);

  return NextResponse.json(tasks);
}