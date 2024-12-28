import { Task } from './task'
export interface Column {
    id: string
    title: string
    boardId: string
    createdAt: Date
    updatedAt: Date
    position: number
    tasks?: Task[]
}
