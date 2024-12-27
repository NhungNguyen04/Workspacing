import { Content } from "@prisma/client";
export async function getContent(contentId: string): Promise<Content> {
  const response = await fetch(`/api/contents/${contentId}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }

  return response.json();
}

export async function updateContent(contentId: string, content: Content): Promise<void> {
  const response = await fetch(`/api/contents/${contentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    throw new Error('Failed to save content');
  }
}
