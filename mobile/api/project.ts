import { GoalCreateRequest, Project, ProjectAnalytics, ProjectCreateRequest,  TaskCreateRequest } from '@/types';
import { ApiResponse } from '@/types/api';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

class ProjectService {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return await client.get<Project[]>(API_ENDPOINTS.PROJECT.LIST);
  }

  async getProjectById(id: string | number): Promise<ApiResponse<Project>> {
    return await client.get<Project>(API_ENDPOINTS.PROJECT.BY_ID(id));
  }

  async createProject(data: ProjectCreateRequest): Promise<ApiResponse<Project>> {
    return await client.post<Project>(API_ENDPOINTS.PROJECT.CREATE, data);
  }


  async deleteProject(id: string | number): Promise<ApiResponse<void>> {
    return await client.delete<void>(API_ENDPOINTS.PROJECT.DELETE(id));
  }

  async getProjectAnalytics(): Promise<ApiResponse<ProjectAnalytics>> {
    return await client.get<ProjectAnalytics>(API_ENDPOINTS.PROJECT.ANALYTICS);
  }

  async createGoal(goalRequest: GoalCreateRequest): Promise<ApiResponse<Project>> {
    return await client.post<Project>(API_ENDPOINTS.PROJECT.GOAL.CREATE, goalRequest);
  }

  async createTask(taskRequest: TaskCreateRequest): Promise<ApiResponse<Project>> {
    return await client.post<Project>(API_ENDPOINTS.PROJECT.TASK.CREATE, taskRequest)
  }
}

export const projectService = new ProjectService();
