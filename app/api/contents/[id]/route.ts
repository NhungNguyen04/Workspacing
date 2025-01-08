import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { updateContent, deleteContent, getContentById } from '@/services/contentService';

export const dynamic = 'force-dynamic';

interface UpdateContentPayload {
  title?: string;
  content?: string;
  categoryIds?: string[];
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    let body: UpdateContentPayload;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate provided fields
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 });
    }

    if (body.content !== undefined && typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Content must be a string' }, { status: 400 });
    }

    if (body.categoryIds !== undefined && !Array.isArray(body.categoryIds)) {
      return NextResponse.json({ error: 'CategoryIds must be an array' }, { status: 400 });
    }

    const updatePayload: UpdateContentPayload = {};
    if (body.title !== undefined) updatePayload.title = body.title.trim();
    if (body.content !== undefined) updatePayload.content = body.content.trim();
    if (body.categoryIds !== undefined) updatePayload.categoryIds = body.categoryIds;

    const updatedContent = await updateContent(id, userId, updatePayload);
    if (!updatedContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    await deleteContent(id, userId);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await  context.params;
    if (!id) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    const content = await getContentById(id, userId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}