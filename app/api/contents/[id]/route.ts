import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 })
    }

    const database = await connectToDatabase()
    const contents = database.collection('contents')

    const content = await contents.findOne({
      _id: new ObjectId(id),
      userId,
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const database = await connectToDatabase()
    const contents = database.collection('contents')

    const result = await contents.updateOne(
      { _id: new ObjectId(id), userId },
      {
        $set: {
          title,
          content,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Content updated successfully' })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id || id === 'undefined' || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 })
    }

    const database = await connectToDatabase()
    const contents = database.collection('contents')

    const result = await contents.deleteOne({ _id: new ObjectId(id), userId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}