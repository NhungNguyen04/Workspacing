import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CreateBoardInput, UpdateBoardInput } from '@/types/board'

const prisma = new PrismaClient()

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const teamspaceId = params.id
    const body: CreateBoardInput = await request.json()
    const { title } = body

    const board = await prisma.board.create({
      data: {
        title,
        teamspaceId,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Failed to create board:', error)
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 })
  }
}

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const teamspaceId = context.params.id

    const boards = await prisma.board.findMany({
      where: { teamspaceId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error('Failed to fetch boards:', error)
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const teamspaceId = params.id
    const body: UpdateBoardInput = await request.json()
    const { id, title } = body

    const updatedBoard = await prisma.board.update({
      where: { id_teamspaceId: { id, teamspaceId } },
      data: { title },
    })

    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error('Failed to update board:', error)
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const teamspaceId = params.id
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Board ID is required' }, { status: 400 })
    }

    await prisma.board.delete({
      where: { id_teamspaceId: { id, teamspaceId } },
    })

    return NextResponse.json({ message: 'Board deleted successfully' })
  } catch (error) {
    console.error('Failed to delete board:', error)
    return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 })
  }
}

