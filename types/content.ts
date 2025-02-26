import { Category } from './category'
import { Task } from './task'

export interface Content {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId?: string | null;
  teamspaceId?: string | null;
  categories: ContentCategory[]
}

export interface ContentCategory {
  content: Content
  contentId: string
  category: Category
  categoryId: string
  assignedAt: Date
}
