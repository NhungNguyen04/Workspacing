import { Board } from '@/types/board';

interface GenerateBoardResponse {
    data?: Board;
    error?: string;
}

export async function generateBoardFromAI(requirement: string): Promise<Board | null> {
    try {
        const params = new URLSearchParams({ requirement });
        const response = await fetch(`/api/ai?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result: GenerateBoardResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to generate board');
        }

        return result.data || null;

    } catch (error) {
        console.error('Error calling AI API:', error);
        return null;
    }
}
