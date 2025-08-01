import { User } from "./user";


interface GoalTask {
  id: string;
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: number; // 1-5 where 1 is highest
  dueDate: string; // ISO date string
  completedAt: string | null; // ISO date string
}

interface ProjectGoalDTO {
  id: string;
  name: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string | null; // ISO date string
  completedAt: string | null; // ISO date string
  tasks: GoalTask[];
}

export interface Project {
  id: string;
  user: User;
  name: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  targetDate: string | null; // ISO date string
  completedAt: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  goals: ProjectGoalDTO[];
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