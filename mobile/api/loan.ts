import { ApiResponse, Loan, LoanAnalytics, LoanProduct, LoanRequest, LoanResponse } from '@/types';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

class LoanService {
    async applyLoan(data: LoanRequest): Promise<ApiResponse<LoanResponse>> {
        return await client.post<LoanResponse>(API_ENDPOINTS.LOAN.APPLY, data);
    }

    async getLoanHistory(): Promise<ApiResponse<Loan[]>> {
        return await client.get<Loan[]>(API_ENDPOINTS.LOAN.HISTORY);
    }

    async getCurrentLoan(): Promise<ApiResponse<Loan>> {
        return await client.get<Loan>(API_ENDPOINTS.LOAN.CURRENT);
    }

    async repayLoan(id: string, amount: number): Promise<ApiResponse<LoanResponse>> {
        return await client.post<LoanResponse>(`/loan/${id}/repay`, { amount });
    }

    async getLoadProducts(): Promise<ApiResponse<LoanProduct[]>> {
        return await client.get<LoanProduct[]>(API_ENDPOINTS.LOAN.PRODUCT);
    }

    async getLoanAnalytics(): Promise<ApiResponse<LoanAnalytics>> {
        return await client.get<LoanAnalytics>(API_ENDPOINTS.LOAN.ANALYTICS);
    }
}

export const loanService = new LoanService();

export async function getLoanProducts(): Promise<LoanProduct[]> {
  const res = await client.get<LoanProduct[]>('/loan-products');
  return res.data;
}