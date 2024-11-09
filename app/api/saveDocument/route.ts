// app/api/saveDocument/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { id, content } = await req.json();

  if (!id || !content) {
    return NextResponse.json({ message: "Missing id or content" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("workspacing"); // Replace with your DB name

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ message: "Invalid ObjectId format" }, { status: 400 });
    }

    const result = await db.collection("contents").updateOne(
      { _id: objectId },
      { $set: { content } },
      { upsert: true }
    );

    return NextResponse.json({ message: "Document saved successfully", result });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save document", error }, { status: 500 });
  }
}
