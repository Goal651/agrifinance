import { adminService } from '@/api/admin';
import {
    LoanStats,
    Summary,
    LoanProduct,
    AdminProjectStats,
    LoanProductRequest,
    Loan,
    User,
    AdminProject,
} from '@/types';
import { useEffect, useState } from "react";

interface UseAdminReturn {
    // Existing state
    loans: Loan[];
    projects: AdminProject[];
    users: User[];
    summary: Summary[];
    loading: boolean;
    loanStats: LoanStats;
    projectStats: AdminProjectStats | null;
    loanProducts: LoanProduct[];

    // Methods
    getProjectById: (id: string) => Promise<AdminProject | null>;
    getProjectStats: () => Promise<AdminProjectStats | null>;
    getLoanProducts: () => Promise<LoanProduct[]>;
    getLoanProductById: (id: string) => Promise<LoanProduct | null>;
    createLoanProduct: (data: LoanProductRequest) => Promise<LoanProduct | null>;
    updateLoanProduct: (id: string, data: LoanProductRequest) => Promise<LoanProduct | null>;
    deleteLoanProduct: (id: string) => Promise<boolean>;
}

export function useAdmin(): UseAdminReturn {

    const [loans, setLoans] = useState<Loan[]>([])
    const [projects, setProjects] = useState<AdminProject[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [summary, setSummary] = useState<Summary[]>([])
    const [loading, setLoading] = useState(false);
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [projectStats, setProjectStats] = useState<AdminProjectStats | null>(null);
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

    const getProjectById = async (id: string): Promise<AdminProject | null> => {
        try {
            const res = await adminService.getProjectById(id);
            return res.success ? res.data : null;
        } catch (error) {
            console.error('Error fetching project:', error);
            return null;
        }
    };

    const getProjectStats = async (): Promise<AdminProjectStats | null> => {
        try {
            const res = await adminService.getProjectStats();
            if (res.success) {
                setProjectStats(res.data);
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching project stats:', error);
            return null;
        }
    };

    const getLoanProducts = async (): Promise<LoanProduct[]> => {
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

    const getLoanProductById = async (id: string): Promise<LoanProduct | null> => {
        try {
            const res = await adminService.getLoanProductById(id);
            return res.success ? res.data : null;
        } catch (error) {
            console.error('Error fetching loan product:', error);
            return null;
        }
    };

    const createLoanProduct = async (data: LoanProductRequest): Promise<LoanProduct | null> => {
        try {
            const res = await adminService.createLoanProduct(data);
            if (res.success) {
                // Refresh the loan products list
                await getLoanProducts();
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('Error creating loan product:', error);
            return null;
        }
    };

    const updateLoanProduct = async (id: string, data: LoanProductRequest): Promise<LoanProduct | null> => {
        try {
            const res = await adminService.updateLoanProduct(id, data);
            if (res.success) {
                // Refresh the loan products list
                await getLoanProducts();
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('Error updating loan product:', error);
            return null;
        }
    };

    const deleteLoanProduct = async (id: string): Promise<boolean> => {
        try {
            const res = await adminService.deleteLoanProduct(id);
            if (res.success) {
                // Remove the deleted product from state
                setLoanProducts(prev => prev.filter(product => product.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting loan product:', error);
            return false;
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    adminService.getLoans().then(res => res.success && setLoans(res.data)),
                    adminService.getProjects().then(res => res.success && setProjects(res.data)),
                    adminService.getUsers().then(res => res.success && setUsers(res.data)),
                    adminService.getLoanProducts().then(res => res.success && setLoanProducts(res.data)),
                    adminService.getProjectStats().then(res => res.success && setProjectStats(res.data)),
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    return {
        loans,
        projects,
        users,
        summary,
        loading,
        loanStats,
        projectStats,
        loanProducts,
        getProjectById,
        getProjectStats,
        getLoanProducts,
        getLoanProductById,
        createLoanProduct,
        updateLoanProduct,
        deleteLoanProduct
    }

}