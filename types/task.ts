export interface Task {
  id: string;
  title: string;
  dueDate?: Date | null;
  reminder: boolean;
  repeat: string;
  status: string;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  columnId: string | null;
  description?: string;
  position?: number | null;
}

export interface TaskInput {
  title: string;
  dueDate?: Date | null;
  reminder: boolean;
  repeat?: string;
  status: string;
  category?: string;
  columnId?: string | null;
  description?: string;
  position?: number | null;
}
