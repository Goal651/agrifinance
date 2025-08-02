import { User } from "./user";

export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'


export interface GoalTask {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: number; // 1-5 where 1 is highest
  dueDate: string; // ISO date string
  completedAt: string | null; // ISO date string
}

export interface ProjectGoal {
  id: string;
  name: string;
  project: Project;
  description: string;
  status: GoalStatus
  dueDate: string | null; // ISO date string
  completedAt: string | null; // ISO date string
  tasks: GoalTask[];
}

export interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget?: number;
  totalFundsUsed?: number;
}

export interface Project {
  id: string;
  user: User;
  name: string;
  description: string;
  status: ProjectStatus
  targetDate: string | null; // ISO date string
  completedAt: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  goals: ProjectGoal[];
}


export interface ProjectCreateRequest {
  name: string;
  description: string;
  targetDate: Date;
}

export interface GoalCreateRequest {
  name: string
  description: string
  project: Project
}

export interface TaskCreateRequest {
  name: string
  description: string
  goal: ProjectGoal
}