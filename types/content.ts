import { Category } from './category'

export interface Content {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: string
  categories: ContentCategory[]
}

export interface ContentCategory {
  content: Content
  contentId: string
  category: Category
  categoryId: string
  assignedAt: Date
}
