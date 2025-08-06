import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loan } from '@/types';
import { adminService } from '@/api/admin';

type AdminContextType = {
    unapprovedLoans: Loan[];
    loading: boolean;
    error: string | null;
    fetchUnapprovedLoans: () => Promise<void>;
    updateLoanStatus: (loanId: string, status: 'APPROVED' | 'REJECTED') => Promise<boolean>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [unapprovedLoans, setUnapprovedLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    const updateLoanStatus = async (loanId: string, status: 'APPROVED' | 'REJECTED'): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await adminService.updateStatus(loanId, status);
            if (res.success) {
                setUnapprovedLoans(prev =>
                    prev.filter(loan => loan.id !== loanId)
                );
            } else {
                setError(res.message || 'Failed to update loan status');
            }

            return true;
        } catch (err) {
            setError(`Failed to ${status.toLowerCase()} loan`);
            console.error(`Error updating loan status:`, err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUnapprovedLoans();
    }, []);

    return (
        <AdminContext.Provider
            value={{
                unapprovedLoans,
                loading,
                error,
                fetchUnapprovedLoans,
                updateLoanStatus
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
