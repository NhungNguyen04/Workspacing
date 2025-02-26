import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getCategoriesByUserId, createCategory, getCategoriesByTeamspaceId } from '@/services/categoryService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');
    if (!teamspaceId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await getCategoriesByTeamspaceId(teamspaceId);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const teamspaceId = searchParams.get('teamspaceId');
    if (!teamspaceId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const body = await req.json();
    if (!body.name || !body.color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 });
    }

    const category = await createCategory({
      name: body.name,
      color: body.color,
      teamspaceId
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
