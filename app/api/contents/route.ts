import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getContentByUserId, createContent } from '@/services/contentService';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userContents = await getContentByUserId(userId);
    return NextResponse.json(userContents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newContent = await createContent({
      title: body.title,
      content: "",
      userId,
      categoryIds: body.categoryIds || [] // Optional category assignments
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}