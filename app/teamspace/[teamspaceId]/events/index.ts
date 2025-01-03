export async function getPersonalEvents(): Promise<any[]> {
  try {
    const response = await fetch(`api/events`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}