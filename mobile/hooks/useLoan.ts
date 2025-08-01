import { loanService } from '@/api/loan';
import { Loan, LoanAnalytics, LoanProduct, LoanRequest } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useLoan() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [currentLoan,setCurrentLoan] = useState<Loan | null>(null);
    const [loanAnalytics, setLoanAnalytics] = useState<LoanAnalytics | null>(null);

    useEffect(() => {
        const fetchLoans = async () => {
            setLoading(true);
            try {
                const res = await loanService.getLoanHistory();
                if (res.success) {
                    setLoans(res.data);
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load loans', text2: res.message });
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
            } finally {
                setLoading(false);
            }
        };
        const fetchCurrentLoan = async () => {
            try {
                const res = await loanService.getCurrentLoan();
                if (res.success) {
                    setCurrentLoan(res.data);
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load current loan', text2: res.message });
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
            }
        };
        const fetchAnalytics = async () => {
            try {
                const res = await loanService.getLoanAnalytics();
                if (res.success) {
                    setLoanAnalytics(res.data);
                }
            } catch (error) {
                // Optionally handle error
            }
        };
        const fetchLoanProducts = async () => {
            try {
                const res = await loanService.getLoanProducts();
                if (res.success) {
                    setLoanProducts(res.data);
                } else {
                    Toast.show({ type: 'error', text1: 'Failed to load loan products', text2: res.message });
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
            }
        };
        fetchLoanProducts();
        fetchCurrentLoan();
        fetchLoans();
        fetchAnalytics();
    }, []);


    const applyLoan = async (data: LoanRequest) => {
        setLoading(true);
        try {
            const res = await loanService.applyLoan(data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Loan application successful' });
                router.push('/(tabs)'); // Navigate to loan history after successful application
            } else {
                Toast.show({ type: 'error', text1: 'Application failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const getLoansHistory = async () => {
        setLoading(true);
        try {
            const res = await loanService.getLoanHistory();
            if (res.success) {
                return res.data;
            } else {
                Toast.show({ type: 'error', text1: 'Failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };


    const repayLoan = async (id: string, amount: number) => {
        setLoading(true);
        try {
            const res = await loanService.repayLoan(id, amount);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Repayment successful' });
                return res.data;
            } else {
                Toast.show({ type: 'error', text1: 'Repayment failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const getLoanAnalytics = async () => {
        setLoading(true);
        try {
            const res = await loanService.getLoanAnalytics();
            if (res.success) {
                setLoanAnalytics(res.data);
                return res.data;
            }
        } catch (error) {
            // Optionally handle error
        } finally {
            setLoading(false);
        }
    };

    const history = loans.map((loan) => ({
        type: loan.details.name || 'Unknown',
        amount: loan.details.amount,
        status: loan.status || 'Unknown',
    }));

    return {
        applyLoan,
        getLoansHistory,
        repayLoan,
        loading,
        loans,
        history,
        currentLoan,
        loanAnalytics,
        getLoanAnalytics,
        loanProducts,
    };
}