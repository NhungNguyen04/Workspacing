import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getContentByUserId, createContent } from '@/services/contentService';
import { getContentsByCategory } from '@/services/categoryService';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
        const userContents = await getContentsByCategory(categoryId);
        return NextResponse.json(userContents);
    } else {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}