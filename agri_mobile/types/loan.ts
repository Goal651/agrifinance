import { Payment } from './payment';
import { User } from './user';

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' ;
export type LoanTermType = 'MONTHS' | 'YEARS';

export const getLoanStatusStyle = (status: LoanStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'PAID':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


/**
 * Loan product data transfer object (DTO) - matches backend schema
 */
export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interest: number;
  amount: number;
  term: number;
  termType: LoanTermType;
}


/**
 * Loan data transfer object (DTO) - matches backend schema
 */
export interface Loan {
  id: string;
  user: User;
  purpose: string;
  status: LoanStatus;
  amount: number; // Total loan amount
  details: LoanProduct;
  payments: Payment[];
  paidAmount: number;
  documents?: DocumentUpload; // Optional document uploads
  createdAt: string;
  updatedAt: string;
  info: LoanInfo;
  // Additional properties used in LoanDetail
  loanNumber?: string;
  interestRate?: number;
  term?: number;
  monthlyPayment?: number;
  comments?: string;
  // Additional loan metadata
  metadata?: {
    // Add any additional metadata fields here
    [key: string]: any;
  };
}

export interface LoanInfo {
  personal: PersonalInfo
  financial: FinancialInfo
  documents: DocumentUpload
}

/**
 * Request payload for creating/updating a loan product (admin only)
 */
export interface LoanProductRequest {
  name: string;
  description: string;
  interest: number;
  amount: number;
  term: number;
  termType: LoanTermType;
}

// Personal Information Interface
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string; // ISO date string
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface FinancialInfo {
  monthlyIncome: number;
  incomeSource: 'SALARY' | 'BUSINESS' | 'FARMING' | 'OTHER';
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED';
  farmingExperience: number;
  farmType: 'INDIVIDUAL' | 'COOPERATIVE' | 'OTHER';
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface LoanAnalytics {
  totalLoans: number;
  totalAmountBorrowed: number;
  totalAmountRepaid: number;
  totalInterestPaid: number;
  activeLoans: number;
  overdueLoans: number;
  defaultRate: number;
  averageLoanAmount: number;
  averageLoanTerm: number;
  byStatus: {
    status: LoanStatus;
    count: number;
    amount: number;
  }[];
  byProduct: {
    productId: string;
    productName: string;
    count: number;
    totalAmount: number;
  }[];
  loanBreakdown: {
    remainingAmount: number;
    interest: number;
    amount: number;
  }[];
  paymentHistory: {
    amount: number;
    date: string;
  }[];
}


/**
 * Request payload for applying for a loan
 */
export interface LoanRequest {
  details: LoanProduct
  purpose: string;
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  documents: DocumentUpload;
}

export interface DocumentUpload {
  idPhoto: string | null;
  proofOfIncome: string | null;
  farmOwnershipDocuments: string | null;
  cooperativeMembership: string | null;
  treeImages: string[];
}

export interface PaymentRequest {
  amount: number
}