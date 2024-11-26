export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  reminder: boolean;
  repeat?: string;
  status: string;
  category?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  columnId: string;
  description?: string;
}

export interface TaskInput {
  title: string;
  dueDate?: Date;
  reminder: boolean;
  repeat?: string;
  status: string;
  category?: string;
  columnId: string;
  description?: string;
}
