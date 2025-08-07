import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminProject, AdminProjectStats, Loan, LoanProduct, LoanStats, Summary, User } from '@/types';
import { adminService } from '@/api/admin';

type AdminContextType = {
    unapprovedLoans: Loan[];
    loading: boolean;
    error: string | null;
    loanProducts: LoanProduct[]
    projectStats: AdminProjectStats | null
    summary: Summary[]
    loanStats: LoanStats
    users: User[]
    loans: Loan[]
    projects: AdminProject[]
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [unapprovedLoans, setUnapprovedLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loans, setLoans] = useState<Loan[]>([])
    const [projects, setProjects] = useState<AdminProject[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [projectStats, setProjectStats] = useState<AdminProjectStats | null>(null);
    const [summary, setSummary] = useState<Summary[]>([])
    const [loanStats, setLoanStats] = useState<LoanStats>({
        total: 0,
        rejected: 0,
        status: []
    })



    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await adminService.getLoans()
                if (res.success) setLoans(res.data)
            } catch (error) {
                console.error(error)
            }
        }


        const fetchProjects = async () => {
            try {
                const res = await adminService.getProjects()
                if (res.success) setProjects(res.data)

            } catch (error) {
                console.error(error)
            }
        }

        const fetchUsers = async () => {
            try {
                const res = await adminService.getUsers()
                if (res.success) setUsers(res.data)

            } catch (error) {
                console.error(error)
            }
        }
        const fetchLoanProducts = async (): Promise<LoanProduct[]> => {
            try {
                const res = await adminService.getLoanProducts();
                if (res.success) {
                    setLoanProducts(res.data);
                    return res.data;
                }
                return [];
            } catch (error) {
                console.error('Error fetching loan products:', error);
                return [];
            }
        };

        const fetchUnapprovedLoans = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await adminService.getUnapproved();
                if (res.success) {
                    setUnapprovedLoans(res.data);
                } else {
                    setError(res.message || 'Failed to fetch unapproved loans');
                }
            } catch (err) {
                setError('Failed to fetch unapproved loans');
                console.error('Error fetching unapproved loans:', err);
            } finally {
                setLoading(false);
            }
        };



        const fetchProjectStats = async () => {
            try {
                const res = await adminService.getProjectStats();
                if (res.success) {
                    setProjectStats(res.data);

                }
            } catch (error) {
                console.error('Error fetching project stats:', error);
            }
        };

        fetchLoanProducts()
        fetchProjectStats()
        fetchUnapprovedLoans()
        fetchLoans()
        fetchUsers()
        fetchProjects()
    }, [])

    useEffect(() => {
        let total = 0;
        let rejected = 0;
        const statusCounts = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            ACTIVE: 0,
            OVERDUE: 0,
            DEFAULTED: 0,
            PAID: 0
        };

        loans.forEach(loan => {
            const amount = loan.details.amount || 0;
            total += amount;

            if (loan.status === 'REJECTED') {
                rejected += amount;
            }

            if (statusCounts.hasOwnProperty(loan.status)) {
                statusCounts[loan.status as keyof typeof statusCounts]++;
            }
        });

        const totalLoans = loans.length || 1; // Avoid division by zero
        const statusStats: LoanStats['status'] = [
            {
                label: 'PENDING',
                value: Math.round((statusCounts.PENDING / totalLoans) * 100) || 0,
                color: 'bg-yellow-400'
            },
            {
                label: 'APPROVED',
                value: Math.round((statusCounts.APPROVED / totalLoans) * 100) || 0,
                color: 'bg-green-500'
            },
            {
                label: 'REJECTED',
                value: Math.round((statusCounts.REJECTED / totalLoans) * 100) || 0,
                color: 'bg-red-500'
            },
            {
                label: 'ACTIVE',
                value: Math.round((statusCounts.ACTIVE / totalLoans) * 100) || 0,
                color: 'bg-blue-400'
            },
            {
                label: 'OVERDUE',
                value: Math.round((statusCounts.OVERDUE / totalLoans) * 100) || 0,
                color: 'bg-orange-500'
            },
            {
                label: 'DEFAULTED',
                value: Math.round((statusCounts.DEFAULTED / totalLoans) * 100) || 0,
                color: 'bg-red-700'
            },
            {
                label: 'PAID',
                value: Math.round((statusCounts.PAID / totalLoans) * 100) || 0,
                color: 'bg-green-300'
            }
        ];

        setLoanStats({
            total,
            rejected,
            status: statusStats
        });
    }, [loans]);

    useEffect(() => {
        const summaryStats: Summary[] = [
            { label: 'Users', value: users.length, sub: users.filter(u => u.status === 'ACTIVE').length, color: 'bg-green-50', text: 'text-green-700' },
            { label: 'Loans', value: loans.length, sub: loans.filter(l => l.status === 'APPROVED' || l.status === 'PENDING').length, color: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Projects', value: projects.length, sub: projects.filter(p => p.status === 'IN_PROGRESS').length, color: 'bg-yellow-50', text: 'text-yellow-700' },
        ]
        setSummary(summaryStats)

    }, [projects, loans, users])


    return (
        <AdminContext.Provider
            value={{
                unapprovedLoans,
                loading,
                error,
                loanProducts,
                loanStats,
                projectStats,
                summary,
                users,
                loans,
                projects
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
