import { Column } from './column'

export interface Board {
  id: string;
  title: string;
  teamspaceId: string;
  color: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  createdAt: Date;
  updatedAt: Date;
  columns?: Column[];
  starred?: boolean; 
}
