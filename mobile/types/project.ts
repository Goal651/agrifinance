export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  goals: Goal[];
}

export interface Goal {
  id: string;
  name: string;
  status: 'active' | 'done';
  progress: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  completed: boolean;
}

export interface ProjectCreateRequest {
  name: string;
  description: string;
  status: string;
  goals: {
    name: string;
    status: 'active' | 'done';
    progress: number;
    activities: {
      name: string;
      completed: boolean;
    }[];
  }[];
}

export interface ProjectUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  status?: string;
  goals?: {
    id: string;
    name?: string;
    status?: 'active' | 'done';
    progress?: number;
    activities?: {
      id: string;
      name?: string;
      completed?: boolean;
    }[];
  }[];
}

export interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget?: number;
  totalFundsUsed?: number;
}