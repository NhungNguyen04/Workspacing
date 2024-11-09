// app/api/getDocument/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    console.error("Missing or invalid id"); // Log missing ID case
    return NextResponse.json({ message: "Missing or invalid id" }, { status: 400 });
  }

  console.log("Received ID:", id); // Log received ID

  try {
    const client = await clientPromise;
    const db = client.db("workspacing"); 

    console.log("Connected to database"); // Log database connection

    let objectId;
    try {
      objectId = new ObjectId(id);
      console.log("Converted ID to ObjectId:", objectId); // Log ObjectId conversion
    } catch (e) {
      console.error("Invalid ObjectId format:", id); // Log invalid ObjectId format
      return NextResponse.json({ message: "Invalid ObjectId format" }, { status: 400 });
    }

    const document = await db.collection("contents").findOne({ _id: objectId });

    if (!document) {
      console.error("Document not found for _id:", id); // Log missing document case

      // Log all documents in the collection
      const allDocuments = await db.collection("documents").find({}).toArray();
      console.log("All documents in the collection:", allDocuments);

      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    console.log("Document found:", document); // Log found document

    return NextResponse.json({ content: document.content });
  } catch (error) {
    console.error("Error loading document:", error); // Log error details
    return NextResponse.json({ message: "Failed to load document", error }, { status: 500 });
  }
}
