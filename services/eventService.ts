import { prisma } from "@/lib/prisma";

export const createEvent = async (
  userId: string,
  data: { title: string; date: Date; description?: string }
) => {
  if (!prisma?.event) {
    throw new Error("Prisma client not initialized");
  }
  
  return await prisma.event.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getEvents = async (userId: string) => {
  return await prisma.event.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getEvent = async (id: string, userId: string) => {
  return await prisma.event.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const updateEvent = async (
  id: string,
  userId: string,
  data: { title?: string; date?: Date; description?: string }
) => {
  return await prisma.event.update({
    where: {
      id,
      userId,
    },
    data,
  });
};

export const deleteEvent = async (id: string, userId: string) => {
  return await prisma.event.delete({
    where: {
      id,
      userId,
    },
  });
};
