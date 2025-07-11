import { Board } from '@/types/board'
import { unsplash } from "@/lib/unsplash";

export interface CreateBoardInput {
  title: string;
  color: string;
  imageThumbUrl?: string;
  imageFullUrl?: string;
}

// Remove the local Board interface and use the imported one

export async function getBoards(teamspaceId: string): Promise<Board[]> {
  try {
    const response = await fetch(`/api/teamspace/boards?teamspaceId=${teamspaceId}`, {
      cache: 'no-store'
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch boards');
    }

    return result.data?.boards || [];
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
}

export async function createBoard(teamspaceId: string, board: CreateBoardInput): Promise<Board> {
  const response = await fetch(`/api/teamspace/boards?teamspaceId=${teamspaceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(board),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create board');
  }

  return data.data; // Assuming the API returns { data: Board }
}

export async function updateBoard(teamspaceId: string, boardId: string, title: string): Promise<Board> {
  const response = await fetch(`/api/teamspace/boards/${boardId}?teamspaceId=${teamspaceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Failed to update board');
  }

  return response.json();
}

export async function deleteBoard(teamspaceId: string, boardId: string): Promise<void> {
  const response = await fetch(`/api/teamspace/boards/${boardId}?teamspaceId=${teamspaceId}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete board');
  }
}

export async function fetchImages() {
  try {
    console.log('Fetching images from Unsplash...');
    const result = await unsplash.photos.getRandom({
      collectionIds: ["317099"],
      count: 9,
    });

    if (result && result.response) {
      return result.response as Array<Record<string, any>>;
    } else {
      console.error('No response from Unsplash:', result);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return null;
  }
}

export async function toggleStarBoard(boardId: string) {
  const response = await fetch(`/api/teamspace/boards/${boardId}/star`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error('Failed to toggle star status');
  }

  return response.json();
}