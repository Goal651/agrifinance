import { client } from './client';
import { API_ENDPOINTS } from './constants';
import type {
    ApiResponse,
    Loan,
    User,
    CreateUser,
    UpdateUserInput,
    LoanApproval,
    AdminDashboardStats,
    LoanProduct,
    LoanProductRequest,
    AdminProjectStats,
    AdminProject
} from '@/types';

class AdminService {
    // User Management
    async getUsers(): Promise<ApiResponse<User[]>> {
        return await client.get<User[]>(API_ENDPOINTS.ADMIN.USER.ALL);
    }

    async getUserById(id: string): Promise<ApiResponse<User>> {
        return await client.get<User>(`${API_ENDPOINTS.ADMIN.USER.ALL}/${id}`);
    }

    async createUser(userData: CreateUser): Promise<ApiResponse<User>> {
        return await client.post<User>(API_ENDPOINTS.ADMIN.USER.CREATE, userData);
    }

    async updateUser(userData: UpdateUserInput): Promise<ApiResponse<User>> {
        const { id, ...data } = userData;
        return await client.put<User>(`${API_ENDPOINTS.ADMIN.USER.ALL}/${id}`, data);
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return await client.delete(`${API_ENDPOINTS.ADMIN.USER.ALL}/${id}`);
    }

    // Loan Management
    async getLoans(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.ADMIN.LOAN.ALL);
    }

    async getLoanById(id: string): Promise<ApiResponse<Loan>> {
        return await client.get<Loan>(`${API_ENDPOINTS.ADMIN.LOAN.BY_ID(id)}`);
    }

    async approveLoan(loanId: string, data?: { comments?: string; conditions?: string[] }): Promise<ApiResponse<Loan>> {
        return await client.put<Loan>(API_ENDPOINTS.ADMIN.LOAN.APPROVE(loanId), data || {});
    }

    async getLoanApprovals(loanId: string): Promise<ApiResponse<LoanApproval[]>> {
        return await client.get<LoanApproval[]>(`${API_ENDPOINTS.ADMIN.LOAN.APPROVED}`);
    }

    async rejectLoan(loanId: string, reason?: string): Promise<ApiResponse<Loan>> {
        return await client.put<Loan>(API_ENDPOINTS.ADMIN.LOAN.REJECT(loanId), { reason });
    }

    // Dashboard
    async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
        return await client.get<AdminDashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD.STATS);
    }

    // Project Management
    async getProjects(): Promise<ApiResponse<AdminProject[]>> {
        return await client.get<AdminProject[]>(API_ENDPOINTS.ADMIN.PROJECT.ALL);
    }

    async getProjectById(id: string): Promise<ApiResponse<AdminProject>> {
        return await client.get<AdminProject>(API_ENDPOINTS.ADMIN.PROJECT.BY_ID(id));
    }

    async getProjectStats(): Promise<ApiResponse<AdminProjectStats>> {
        return await client.get<AdminProjectStats>(API_ENDPOINTS.ADMIN.PROJECT.STATS);
    }

    // Loan Product Management
    async getLoanProducts(): Promise<ApiResponse<LoanProduct[]>> {
        return await client.get<LoanProduct[]>(API_ENDPOINTS.ADMIN.LOAN_PRODUCT.ALL);
    }

    async getLoanProductById(id: string): Promise<ApiResponse<LoanProduct>> {
        return await client.get<LoanProduct>(API_ENDPOINTS.ADMIN.LOAN_PRODUCT.BY_ID(id));
    }

    async createLoanProduct(data: LoanProductRequest): Promise<ApiResponse<LoanProduct>> {
        return await client.post<LoanProduct>(API_ENDPOINTS.ADMIN.LOAN_PRODUCT.CREATE, data);
    }

    async updateLoanProduct(id: string, data: LoanProductRequest): Promise<ApiResponse<LoanProduct>> {
        return await client.put<LoanProduct>(API_ENDPOINTS.ADMIN.LOAN_PRODUCT.UPDATE(id), data);
    }

    async deleteLoanProduct(id: string): Promise<ApiResponse<void>> {
        return await client.delete(API_ENDPOINTS.ADMIN.LOAN_PRODUCT.DELETE(id));
    }

    async getUnapproved(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.ADMIN.LOAN.UNAPPROVED);
    }

    async updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<Loan>> {
        return await client.put<Loan>(API_ENDPOINTS.ADMIN.LOAN.UPDATE_STATUS(id), { status });
    }
}

export const adminService = new AdminService();
