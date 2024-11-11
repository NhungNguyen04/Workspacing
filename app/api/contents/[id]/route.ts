import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('MONGODB_URI is not defined')
}

let client: MongoClient | null = null

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri!)
    await client.connect()
  }
  return client.db('workspacing')
}

// Define the route segment config
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> } // Updated typing
) {
  const { id } = context.params

  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid content ID format' }, { status: 400 })
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
  context: { params: Record<string, string> } // Updated typing
) {
  const { id } = context.params

  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid content ID format' }, { status: 400 })
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
