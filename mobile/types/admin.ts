import { LoanStatus, Loan } from "./loan"

export interface Summary {
    label: 'Users' | 'Loans' | 'Projects'
    value: number
    sub: number
    color: 'bg-green-50' | 'bg-blue-50' | 'bg-yellow-50'
    text: 'text-green-700' | 'text-blue-700' | 'text-yellow-700'
}

export interface LoanStats {
    total: number
    rejected: number
    status: {
        label: LoanStatus
        value: number
        color: 'bg-yellow-400' | 'bg-green-500' | 'bg-red-500'
    }[]
}

export interface UserRole {
    id: string
    name: 'admin' | 'loan_officer' | 'farmer' | 'viewer'
    permissions: string[]
}

export interface UserAdmin {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: UserRole
    status: 'active' | 'inactive' | 'suspended'
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export interface CreateUserInput {
    firstName: string
    lastName: string
    email: string
    phone?: string
    roleId: string
    password?: string
    sendInvite?: boolean
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
    id: string
    status?: 'active' | 'inactive' | 'suspended'
}

export interface LoanApproval {
    id: string
    loanId: string
    loan?: Loan
    approvedBy: string
    approver?: UserAdmin
    status: 'pending' | 'approved' | 'rejected'
    comments?: string
    conditions?: string[]
    approvedAt?: string
    createdAt: string
    updatedAt: string
}

export interface ApproveLoanInput {
    loanId: string
    status: 'approved' | 'rejected'
    comments?: string
    conditions?: string[]
}

export interface UserFilters {
    search?: string
    status?: string
    role?: string
    page?: number
    limit?: number
}

export interface LoanFilters extends UserFilters {
    status?: LoanStatus
    minAmount?: number
    maxAmount?: number
    startDate?: string
    endDate?: string
}

export interface PaginatedResult<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface AdminDashboardStats {
    totalUsers: number
    activeUsers: number
    totalLoans: number
    pendingLoans: number
    approvedLoans: number
    rejectedLoans: number
    totalLoanAmount: number
    totalRepaid: number
    loanStatusDistribution: {
        status: LoanStatus
        count: number
        amount: number
    }[]
    recentActivities: {
        id: string
        type: 'user_created' | 'loan_approved' | 'loan_rejected' | 'payment_received'
        description: string
        timestamp: string
        user?: Pick<UserAdmin, 'id' | 'firstName' | 'lastName' | 'email'>
        loan?: Pick<Loan, 'id' | 'loanNumber' | 'amount'>
    }[]
}