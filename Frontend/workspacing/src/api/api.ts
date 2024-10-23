// src/api.ts

import axios from 'axios';
import { Board } from '../interfaces/interfaces';

const API_URL = 'http://localhost:3033'; // Adjust the URL as needed

export const fetchBoard = async (boardId: string): Promise<Board> => {
  console.log(`${API_URL}/board/${boardId}`);
  try {
    const response = await axios.get(`${API_URL}/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching board:', error);
    throw error;  // Optionally throw the error to handle it outside this function
  }
};

