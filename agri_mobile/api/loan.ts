import { ApiResponse, Loan, LoanAnalytics, LoanProduct, LoanRequest } from '@/types';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

class LoanService {
    async applyLoan(data: LoanRequest): Promise<ApiResponse<Loan>> {
        return await client.post<Loan>(API_ENDPOINTS.LOAN.APPLY, data);
    }

    async getLoanHistory(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.LOAN.ALL);
    }

    async getCurrentLoan(): Promise<ApiResponse<Loan>> {
        return await client.get<Loan>(API_ENDPOINTS.LOAN.CURRENT);
    }

    async repayLoan(amount: number): Promise<ApiResponse<Loan>> {
        return await client.post<Loan>(`/loan/repay`, { amount });
    }

    async getLoanAnalytics(): Promise<ApiResponse<LoanAnalytics>> {
        return await client.get<LoanAnalytics>(API_ENDPOINTS.LOAN.ANALYTICS);
    }

    async getLoanProducts(): Promise<ApiResponse<LoanProduct[]>> {
        return await client.get<LoanProduct[]>(API_ENDPOINTS.LOAN.PRODUCT);
    }
}

export const loanService = new LoanService();
