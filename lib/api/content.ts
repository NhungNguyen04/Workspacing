import { Content } from '@/types/content'
import { Category } from '@/types/category'

export async function getContents(): Promise<Content[]> {
  const response = await fetch(`/api/contents`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contents');
  }

  return response.json();
}

export async function getTeamspaceContents(teamspaceId: string): Promise<Content[]> {
  const response = await fetch(`/api/teamspace/contents?teamspaceId=${teamspaceId}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch teamspace contents');
  }

  return response.json();
}

export async function getContentsByCategory(categoryId: string): Promise<Content[]> {
  const response = await fetch(`/api/contents/category?categoryId=${categoryId}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contents by category');
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

export async function getTeamspaceCategories(teamspaceId: string): Promise<Category[]> {
  const response = await fetch(`/api/teamspace/categories?teamspaceId=${teamspaceId}`, {
    cache: 'no-store'
  });
  console.log("res", response);
  if (!response.ok) {
    throw new Error('Failed to fetch teamspace categories');
  }
  return response.json();
}

export async function createContent(title: string, categoryIds?: string[]): Promise<Content> {
  const response = await fetch(`/api/contents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, categoryIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to create content');
  }

  return response.json();
}

export async function createTeamspaceContent(title: string, teamspaceId: string, categoryIds?: string[]): Promise<Content> {
  const response = await fetch(`/api/teamspace/contents?teamspaceId=${teamspaceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, categoryIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to create content');
  }

  return response.json();
}

export async function updateContent(
  contentId: string, 
  title: string, 
  content: string,
  categoryIds?: string[]
): Promise<Content> {
  const payload = {
    title: title.trim(),
    categoryIds: categoryIds || []
  };

  const response = await fetch(`/api/contents/${contentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update content');
  }

  return data;
}

export async function deleteContent(contentId: string): Promise<void> {
  const response = await fetch(`/api/contents/${contentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete content');
  }
}

export async function createCategory(name: string, color: string): Promise<Category> {
  const response = await fetch(`/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return response.json();
}

export async function createTeamspaceCategory(name: string, color: string, teamspaceId: string): Promise<Category> {
  const response = await fetch(`/api/teamspace/categories?teamspaceId=${teamspaceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return response.json();
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}

export async function getContentTasks(contentId: string) {
  const response = await fetch(`/api/contents/tasks?contentId=${contentId}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch content tasks');
  }

  return response.json();
}

