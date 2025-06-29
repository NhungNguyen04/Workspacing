import { Content } from "./content";
import { Task } from "./task";

export interface TaskContent {
  id: string;
  task: Task;
  taskId: string;
  assignedAt: Date;
  content: Content;
  contentId: string;
  createdAt: Date;
  updatedAt: Date;
}