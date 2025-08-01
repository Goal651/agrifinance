import { User } from "./user"

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type LoanTermType = 'MONTHS' | 'YEARS'

export interface LoanPayments {
    id: string
    amount: number
    dueDate: Date
    paidDate: Date
    status: string
}


export interface Loan {
    id: string
    user: User
    status: LoanStatus
    details: LoanProduct
    payments: LoanPayments[]
    paidAmount: number
    purpose:string
    info: {
        personal: PersonalInfo
        financial: FinancialInfo
        documents: DocumentUpload
    }
    createdAt: Date
    updatedAt: Date
}


export interface LoanProduct {
    id: string
    name: string
    description: string
    amount: number
    interest: number
    term: number
    termType: LoanTermType
}

// Personal Information Interface
export interface PersonalInfo {
    firstName: string
    lastName: string
    idNumber: string
    dateOfBirth: string
    streetAddress: string
    city: string
    state: string
    postalCode: string
    country: string
}


// Financial Information Interface
export interface FinancialInfo {
    monthlyIncome: number
    annualIncome: number
    incomeSource: 'farming' | 'employment' | 'business' | 'other'
    employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired'
    farmingExperience: number
    farmType: 'crop' | 'livestock' | 'mixed' | 'other'
    bankName: string
    bankBranch: string
    accountNumber: string
    accountHolderName: string
}

// Document Upload Interface
export interface DocumentUpload {
    idPhoto: string | null
    proofOfIncome: string | null
    farmOwnershipDocuments: string | null
    cooperativeMembership: string | null
    treeImages: string[]
}

export interface LoanRequest {
    purpose:string
    details: LoanProduct
    personalInfo: PersonalInfo
    financialInfo: FinancialInfo
    documents: DocumentUpload
}

export interface LoanAnalytics {
    totalLoans: number
    totalAmountBorrowed: number
    totalAmountRepaid: number
    totalInterestPaid: number
    activeLoans: number
    overduePayments: number
    nextPaymentDueDate: string | null
    nextPaymentAmount: number | null
    repaymentProgress: number
    loanBreakdown: {
        loanId: string
        type: string
        amount: number
        interest: number
        status: string
        createdAt: string
        repaidAmount: number
        remainingAmount: number
    }[]
    paymentHistory: {
        paymentId: string
        loanId: string
        amount: number
        paidDate: string
        status: 'Paid' | 'Upcoming' | 'Overdue'
    }[]
}
