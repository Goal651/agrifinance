import { Loan } from './loan';

export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'NOT_PAID'

export interface Payment {
  id: string;
  amount: number
  status: PaymentStatus
  dueDate: string
  paidAt: string
  loan: Loan
}

export interface MakePaymentRequest {
  amount: number
}
