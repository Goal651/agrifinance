export interface Project {
    id: string
    userId: string
    name: string
    description: string
    status: string
    type: string
    createdAt: Date
    updatedAt: Date
    goals: [{

        id: string
        name: string
        description: string
        status: string
        priority: string
    }]
}

export interface ProjectCreateRequest {
  name: string;
  description: string;
  type?: string;
  goals?: {
    name: string;
    description?: string;
    status?: string;
    priority?: string;
  }[];
  // Add more fields as needed
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  goals?: {
    id?: string;
    name?: string;
    description?: string;
    status?: string;
    priority?: string;
  }[];
  // Add more fields as needed
}

export interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget?: number;
  totalFundsUsed?: number;
}