import { Board } from '@/types/board'
import { toast } from '@/hooks/use-toast'

export async function fetchBoard(boardId: string): Promise<Board | null> {
  try {
    const response = await fetch(`/api/teamspace/boards/${boardId}`);
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to fetch board" });
      throw new Error('Failed to fetch board');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching board:', error);
    toast({ title: "Error", description: "Failed to fetch board" });
    return null;
  }
}

export async function updateBoard(boardId: string, title: string): Promise<Board | null> {
  try {
    const response = await fetch(`/api/teamspace/boards/${boardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to update board');
    return response.json();
  } catch (error) {
    console.error('Error updating board:', error);
    toast({ title: "Error", description: "Failed to update board" });
    return null;
  }
}

export async function deleteBoard(boardId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/teamspace/boards/${boardId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete board');
    return true;
  } catch (error) {
    console.error('Error deleting board:', error);
    toast({ title: "Error", description: "Failed to delete board" });
    return false;
  }
}
