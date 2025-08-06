import { User } from './user';

export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'NOT_STARTED'|'COMPLETED'|'IN_PROGRESS';
export type TaskStatus = 'COMPLETED' | 'NOT_STARTED' | 'IN_PROGRESS';
export type GoalStatus = 'COMPLETED' | 'NOT_STARTED' | 'IN_PROGRESS';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  worker:Worker
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  status: GoalStatus;
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tasks: Task[];
}

/**
 * Project data transfer object (DTO) - matches backend schema
 */
export interface Project {
  id: string;
  user: User
  name: string;
  description: string;
  status: ProjectStatus;
  goals: Goal[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  targetDate?: string; // ISO date string
  completedAt?: string; // ISO date string
}

// Request payloads
export interface ProjectRequest {
  name: string;
  description: string;
  targetDate: Date
}

export interface GoalRequest {
  name: string;
  description: string;
  targetDate?: string; // ISO date string
  project: Project;
}

export interface TaskRequest {
  name: string;
  description: string;
  goal: Goal;
  worker:Worker
}

// Update request payloads
export interface ProjectUpdateRequest extends ProjectRequest {
  id: string;
}

export interface GoalUpdateRequest extends GoalRequest {
  id: string;
}

export interface TaskUpdateRequest extends TaskRequest {
  id: string;
}

// Dashboard/Stats interfaces
export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  cancelled: number;
  byStatus: {
    status: ProjectStatus;
    count: number;
    percentage: number;
  }[];
  recentProjects: Project[];
}

// Request payloads for project operations
export interface ProjectCreateRequest {
  name: string;
  description: string;
  targetDate?: string; // ISO date string
  status?: ProjectStatus;
  assignedUserIds?: string[]; // Array of user IDs to assign to the project
}

export interface GoalCreateRequest {
  name: string;
  description: string;
  project: Project;
}

export interface TaskCreateRequest {
  name: string;
  description: string;
  dueDate?: string; // ISO date string
  goalId: string;
  assignedToId?: string; // ID of the user this task is assigned to
}

// Dashboard response
export interface ProjectDash {
  active: number
  completed: number
  total: number
  activeProjects: Project[]
}