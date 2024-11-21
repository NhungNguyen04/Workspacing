import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userContents = await prisma.content.findMany({
      where: { userId }
    })

    return NextResponse.json(userContents)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title } = await req.json()

    const newContent = await prisma.content.create({
      data: {
        title,
        content: '',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('Error creating content:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}