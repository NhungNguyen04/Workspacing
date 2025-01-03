"use client"
import MainView from "@/components/events/MainView";
import Header from "@/components/events/header/Header";
import { CalendarEventType } from "@/store/EventStore";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getPersonalEvents } from ".";
import dayjs from "dayjs";

export default function EventPage() {
  const { userId } = useAuth();
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) {
        redirect("/sign-in");
      } else {
        const events = await getPersonalEvents();
        const formattedEvents = events.map(event => ({
          ...event,
          date: dayjs(event.date),
          description: event.description || ""
        }));
        setEvents(formattedEvents);
      }
    };
    fetchEvents();
  }, [userId]);

  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="">
      <Header/>
      <MainView eventsData={events as CalendarEventType[]} />
    </div>
  );
}
