// src/interfaces.ts

export interface Task {
    _id: string;
    title: string;
  }
  
  export interface Column {
    _id: string;
    columnName: string;
    tasks: Task[];
  }
  

  export interface Board {

    boardId: string;
  
    boardName: string;
  
    backgroundImg: string;
  
    columns: Column[];
  
  }
  