import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Document } from '@/models/Document'

export async function GET(
  req: NextRequest,
  context: { params: { teamId: string; id: string } }
) {
  const { params } = context;
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('collaborativeDocs')
    const documentsCollection = db.collection<Document>('documents')

    // TODO: Implement team membership check

    const document = await documentsCollection.findOne({
      _id: new ObjectId(params.id),
      teamId: params.teamId
    })

    if (!document) {
      return new NextResponse('Document not found', { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching team document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { teamId: string; id: string } }
) {
  const { params } = context;
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, content } = await req.json()

    const client = await clientPromise
    const db = client.db('workspacing')
    const documentsCollection = db.collection<Document>('documents')

    // TODO: Implement team membership and permission check

    const result = await documentsCollection.updateOne(
      { _id: new ObjectId(params.id), teamId: params.teamId },
      {
        $set: {
          title,
          content,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return new NextResponse('Document not found or unauthorized', { status: 404 })
    }

    return new NextResponse('Team document updated successfully', { status: 200 })
  } catch (error) {
    console.error('Error updating team document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}