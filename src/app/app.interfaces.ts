export interface WorkspaceData {
  id: number;
  name: string;
  role: string;
}

export interface LoginData {
  adminToken: string;
  name: string;
  workspaces: WorkspaceData[];
  isSuperadmin: boolean;
}
