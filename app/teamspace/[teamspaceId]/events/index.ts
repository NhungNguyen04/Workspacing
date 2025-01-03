
async function getEvents() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events`, {
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