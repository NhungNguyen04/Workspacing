export interface Board {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    teamspaceId: string;
  }
  
  export interface CreateBoardInput {
    title: string;
    teamspaceId: string;
  }
  
  export interface UpdateBoardInput {
    id: string;
    title: string;
    teamspaceId: string;
  }

  
  