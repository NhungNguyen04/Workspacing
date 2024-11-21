import { auth, currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const {userId} = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const json = await request.json()
  const task = await prisma.task.create({
    data: {
      ...json,
      userId: userId,
    },
  })

  return NextResponse.json(task)
}

export async function GET() {
  const {userId} = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(tasks)
}