import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as eventService from "@/services/eventService";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, date, description } = body;

    if (!title || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    const event = await eventService.createEvent(userId, { 
      title, 
      date: parsedDate, 
      description 
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    if (error instanceof TypeError && error.message.includes('is not a function')) {
      return new NextResponse("Service initialization error", { status: 500 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await  auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const events = await eventService.getEvents(userId);
    return NextResponse.json(events);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
