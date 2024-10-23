// src/interfaces.ts

export interface Task {
    _id: string;
    title: string;
  }
  
  export interface Column {
    _id: string;
    columnName: string;
    items: Task[];
  }
  
  export interface Board {
    _id: string;
    name: string;
    backgroundImg: string;
    columns: Column[];
    contents: {
      columnName: string;
      items: string[];
    }[];
    createdAt: Date;
    updatedAt: Date;
  }