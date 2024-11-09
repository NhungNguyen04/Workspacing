// app/api/generateId/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  // Generate a new ObjectId and return it as a string
  const newContentId = new ObjectId().toString();
  return NextResponse.json({ contentId: newContentId });
}
