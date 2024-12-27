import {Column} from './column'
export interface Board {
  id: string;
  title: string;
  color: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  teamspaceId: string;
  columns?: Column[];
}
