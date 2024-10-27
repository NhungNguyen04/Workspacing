import axios from 'axios';

export interface Task {
  taskId: string;
  taskName: string;
}

export interface Column {
  columnId: string;
  columnName: string;
  tasks: Task[];
}

export interface Board {
  _id: string;
  name: string;
  backgroundImg: string;
  teamspace: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:3033'; // Adjust this if your API is hosted elsewhere

export const fetchBoard = async (boardId: string): Promise<Board> => {
  const response = await axios.get<Board>(`${API_BASE_URL}/board/${boardId}`);
  return response.data;
};

export const addColumn = async (boardId: string, columnName: string): Promise<Column> => {
  const response = await axios.post<Column>(`${API_BASE_URL}/board/${boardId}/column`, { columnName });
  return response.data;
};

export const addTask = async (boardId: string, columnId: string, taskName: string): Promise<Task> => {
  const response = await axios.post<Task>(`${API_BASE_URL}/board/${boardId}/column/${columnId}`, { taskName });
  return response.data;
};

export const updateBoard = async (boardId: string, updatedBoard: Partial<Board>): Promise<Board> => {
  const response = await axios.put<Board>(`${API_BASE_URL}/board/${boardId}`, updatedBoard);
  return response.data;
};