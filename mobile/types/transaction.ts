import { User } from './user';

export enum TransactionType {
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  FEE_PAYMENT = 'FEE_PAYMENT',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  OTHER = 'OTHER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description?: string;
  reference: string;
  metadata?: Record<string, unknown>;
  createdBy?: User;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  reference?: string;
  page?: number;
  limit?: number;
}
