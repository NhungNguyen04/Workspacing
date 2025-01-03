import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getEvent, updateEvent, deleteEvent } from "@/services/eventService";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await getEvent(params.eventId, userId);
    return NextResponse.json(event);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await  auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, date, description } = body;

    const event = await updateEvent(params.eventId, userId, { 
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
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await deleteEvent(params.eventId, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
