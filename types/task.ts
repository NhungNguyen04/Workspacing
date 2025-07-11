import { Column } from './column';
import { Content } from './content';
import { TaskContent } from './taskContent';
export interface Task {
  id: string;
  title: string;
  dueDate?: Date | null;
  reminder: boolean;
  repeat: string;
  status: string;
  category: string;
  userId?: string | null;
  teamspaceId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  columnId?: string | null;
  description?: string | null;
  position?: number | null;
  assignedTo?: string[];
  content: TaskContent[];
}

export interface TaskWithColumn extends Task {
  column: Column;
}

