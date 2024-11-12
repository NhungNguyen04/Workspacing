import { ObjectId } from 'mongodb'

export interface Document {
  _id?: ObjectId
  title: string
  content: string
  ownerId: string
  teamId?: string
  createdAt: Date
  updatedAt: Date
  sharedWith?: string[]
}

export const DocumentSchema = {
  title: { type: String, required: true },
  content: { type: String, required: true },
  ownerId: { type: String, required: true },
  teamId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sharedWith: { type: [String], default: [] }
}