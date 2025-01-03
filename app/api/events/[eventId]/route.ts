import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getEvent, updateEvent, deleteEvent } from "@/services/eventService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const params = await context.params;
    const event = await getEvent(params.id, userId);
    return NextResponse.json(event);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await  auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, date, description } = body;
    const params = await context.params;

    const event = await updateEvent(params.id, userId, { 
      title, 
      date: date ? new Date(date) : undefined, 
      description 
    });
    return NextResponse.json(event);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const params = await context.params;
    await deleteEvent(params.id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
