import { LoanStatus } from "./loan"

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