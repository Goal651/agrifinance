import { ApiResponse, Loan, Project, User } from '@/types';
import { client } from './client';
import { API_ENDPOINTS } from './constants';
import {
    UserRole,
    CreateUserInput,
    UpdateUserInput,
    UserFilters,
    LoanFilters,
    PaginatedResult,
    LoanApproval,
    ApproveLoanInput,
    AdminDashboardStats
} from '@/types/admin';

class AdminService {
    // User Management
    async getUsers(): Promise<ApiResponse<User[]>> {
        return await client.get<User[]>(API_ENDPOINTS.ADMIN.USER.ALL);
    }

    async getUserById(id: string): Promise<ApiResponse<User>> {
        return await client.get<User>(`${API_ENDPOINTS.ADMIN.USER.BASE}/${id}`);
    }

    async createUser(userData: CreateUserInput): Promise<ApiResponse<User>> {
        return await client.post<User>(API_ENDPOINTS.ADMIN.USER.CREATE, userData);
    }

    async updateUser(userData: UpdateUserInput): Promise<ApiResponse<User>> {
        const { id, ...data } = userData;
        return await client.put<User>(`${API_ENDPOINTS.ADMIN.USER.BASE}/${id}`, data);
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return await client.delete(`${API_ENDPOINTS.ADMIN.USER.BASE}/${id}`);
    }

    // Role Management
    async getRoles(): Promise<ApiResponse<UserRole[]>> {
        return await client.get<UserRole[]>(API_ENDPOINTS.ADMIN.ROLE.ALL);
    }

    // Loan Management
    async getLoans(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.ADMIN.LOAN.ALL);
    }

    async getLoanById(id: string): Promise<ApiResponse<Loan>> {
        return await client.get<Loan>(`${API_ENDPOINTS.ADMIN.LOAN.BASE}/${id}`);
    }

    async approveLoan(approvalData: ApproveLoanInput): Promise<ApiResponse<LoanApproval>> {
        return await client.post<LoanApproval>(`${API_ENDPOINTS.ADMIN.LOAN.APPROVE}`, approvalData);
    }

    async getLoanApprovals(loanId: string): Promise<ApiResponse<LoanApproval[]>> {
        return await client.get<LoanApproval[]>(`${API_ENDPOINTS.ADMIN.LOAN.BASE}/${loanId}/approvals`);
    }

    // Dashboard
    async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
        return await client.get<AdminDashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
    }

    // Project Management
    async getProjects(): Promise<ApiResponse<Project[]>> {
        return await client.get<Project[]>(API_ENDPOINTS.ADMIN.PROJECT.ALL);
    }
}

export const adminService = new AdminService();
