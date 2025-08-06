import { LoanStatus, Loan } from "./loan"
import { Project } from "./project"
import { User, UserRole, UserStatus } from "./user"

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
        label: string
        value: number
        color: 'bg-yellow-400' | 'bg-green-500' | 'bg-red-500' | 'bg-blue-400' | 'bg-orange-500' | 'bg-red-700' | 'bg-green-300'
    }[]
}

export interface UserAdmin extends User {
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export interface AdminProject extends Project {
    progress: number
}

export interface CreateUser {
    firstName: string
    lastName: string
    email: string
    password: string
    role: UserRole
}

export interface UpdateUserInput extends CreateUser {
    id: string
    status?: UserStatus
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

export interface AdminProjectStats {
    totalProjects: number 
    activeProjects: number
    completedProjects: number
    totalFunding: number
    avgCompletionTime: number
    projectsByStatus: {
        status: string
        count: number
    }[]
}

export interface AdminDashboardStats {
    totalUsers: number
    totalProjects: number
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
}