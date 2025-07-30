import { User } from "./user"

export interface Loan {
    id: string
    user: User
    amount: number
    interest: number
    status: string
    type: string
    createdAt: Date
    updatedAt: Date
    paidAmount: number

    payments: [{
        id: string
        amount: number
        dueDate: Date
        paidDate: Date
        status: string
    }]
}

export type LoanTermType = 'months' | 'years';

export interface LoanProduct {
    name: string;
    description: string;
    minAmount: number;
    interest: number;
    termMonths: number;
}

// Personal Information Interface
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Financial Information Interface
export interface FinancialInfo {
    monthlyIncome: number;
    annualIncome: number;
    incomeSource: 'farming' | 'employment' | 'business' | 'other';
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
    farmingExperience: number; // years
    farmType: 'crop' | 'livestock' | 'mixed' | 'other';
    bankName: string;
    bankBranch: string;
    accountNumber: string;
    accountHolderName: string;
}

// Document Upload Interface
export interface DocumentUpload {
    idPhoto: string | null;
    proofOfIncome: string | null;
    farmOwnershipDocuments: string | null;
    cooperativeMembership: string | null; // NEW: Proof of cooperative membership
    treeImages: string[]; // Array of image URIs (max 15)
}

export interface LoanRequest {
    amount: number;
    interest: number;
    type: string // e.g., 'personal', 'business', etc.
    term: number // in months or years, depending on termType
    termType: LoanTermType; // use the defined type
    purpose: string // e.g., 'education', 'home improvement', etc.
    personalInfo?: PersonalInfo;
    financialInfo?: FinancialInfo;
    documents?: DocumentUpload;
}

export interface LoanResponse {
    id: string;
    amount: number;
    term: number;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected' | 'repaid';
    createdAt: string;
    updatedAt: string;
    // Add other fields as needed
}

export interface LoanAnalytics {
  totalLoans: number;
  totalAmountBorrowed: number;
  totalAmountRepaid: number;
  totalInterestPaid: number;
  activeLoans: number;
  overduePayments: number;
  nextPaymentDueDate: string | null;
  nextPaymentAmount: number | null;
  repaymentProgress: number;
  loanBreakdown: {
    loanId: string;
    type: string;
    amount: number;
    interest: number;
    status: string;
    createdAt: string;
    repaidAmount: number;
    remainingAmount: number;
  }[];
  paymentHistory: {
    paymentId: string;
    loanId: string;
    amount: number;
    paidDate: string;
    status: 'Paid' | 'Upcoming' | 'Overdue';
  }[];
}
