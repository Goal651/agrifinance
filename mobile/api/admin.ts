import { ApiResponse, Loan, Project, User } from '@/types';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

class AdminService {
    async getLoans(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.ADMIN.LOAN.ALL);
    }

    async getProjects(): Promise<ApiResponse<Project[]>> {
        return await client.get<Project[]>(API_ENDPOINTS.ADMIN.PROJECT.ALL);
    }

    async getUsers(): Promise<ApiResponse<User[]>> {
        return await client.get<User[]>(API_ENDPOINTS.ADMIN.USER.ALL);
    }

}

export const adminService = new AdminService
