import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getUserContents, createContent } from '@/services/contentService';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userContents = await getUserContents(userId);
    return NextResponse.json(userContents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title } = await req.json();
    const newContent = await createContent(userId, title);
    return NextResponse.json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}