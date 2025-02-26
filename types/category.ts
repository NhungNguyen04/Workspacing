import { Content, ContentCategory } from './content'

export interface Category {
  id: string
  name: string
  color: string
  createdAt: Date
  updatedAt: Date
  userId?: string
  teamspaceId?: string
  contents: ContentCategory[]
}
