import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('MONGODB_URI is not defined')
}
const client = new MongoClient(uri)

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await client.connect()
    const database = client.db('workspacing')
    const contents = database.collection('contents')

    const userContents = await contents.find({ userId }).toArray()

    return NextResponse.json(userContents)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title } = await req.json()

    await client.connect()
    const database = client.db('workspacing')
    const contents = database.collection('contents')

    const newContent = {
      title,
      content: '',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await contents.insertOne(newContent)

    return NextResponse.json({ id: result.insertedId, ...newContent })
  } catch (error) {
    console.error('Error creating content:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    await client.close()
  }
}