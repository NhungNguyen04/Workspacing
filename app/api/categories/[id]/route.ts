import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getContentsByCategory, assignContentToCategory, deleteCategory } from '@/services/categoryService';
import { updateContent } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET(
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const contents = await getContentsByCategory(id);
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching category contents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: categoryId } = await context.params;
    const { contentId } = await request.json();

    if (!categoryId || !contentId) {
      return NextResponse.json({ error: 'Category ID and Content ID are required' }, { status: 400 });
    }

    const result = await assignContentToCategory(contentId, categoryId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error assigning content to category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    const { id: categoryId } = await context.params;

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID and Content ID are required' }, { status: 400 });
    }

    await deleteCategory( categoryId);
    return NextResponse.json({ message: 'Content removed from category successfully' });
  } catch (error) {
    console.error('Error removing content from category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
