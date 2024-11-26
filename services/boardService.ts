import axios from 'axios'
import { Board, CreateBoardInput, UpdateBoardInput } from '@/types/board'

export const boardService = {
  createBoard: async (teamspaceId: string, input: CreateBoardInput): Promise<Board> => {
    const response = await axios.post<Board>(`/api/teamspace/${teamspaceId}/boards`, input)
    return response.data
  },

  getBoards: async (teamspaceId: string): Promise<Board[]> => {
    const response = await axios.get<Board[]>(`/api/teamspace/${teamspaceId}/boards`)
    return response.data
  },

  updateBoard: async (teamspaceId: string, input: UpdateBoardInput): Promise<Board> => {
    const response = await axios.put<Board>(`/api/teamspace/${teamspaceId}/boards`, input)
    return response.data
  },

  deleteBoard: async (teamspaceId: string, id: string): Promise<void> => {
    await axios.delete(`/api/teamspace/${teamspaceId}/boards?id=${id}`)
  },
}

