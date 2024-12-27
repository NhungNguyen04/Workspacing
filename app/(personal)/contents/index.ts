import { Content  } from '@/types/content'
import { unsplash } from "@/lib/unsplash";

// Remove the local Content interface and use the imported one

export async function getContents(): Promise<Content[]> {
  const response = await fetch(`/api/contents`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contents');
  }

  return response.json();
}

export async function createContent(title: string): Promise<Content> {
  const response = await fetch(`/api/contents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title }),
  });

  if (!response.ok) {
    throw new Error('Failed to create board');
  }

  return response.json();
}

export async function updateContent(contentId: string, title: string, content: string): Promise<Content> {
  const response = await fetch(`/api/contents/${contentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to update content');
  }

  return response.json();
}

export async function deleteContent(contentId: string): Promise<void> {
  const response = await fetch(`/api/contents/${contentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete content');
  }
}

