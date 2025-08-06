import { loanService } from '@/api/loan';
import { LoanRequest } from '@/types';
import Toast from 'react-native-toast-message';

export function useLoanAction() {

    const applyLoan = async (data: LoanRequest) => {
        try {
            const res = await loanService.applyLoan(data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Loan application successful' });
            } else {
                Toast.show({ type: 'error', text1: 'Application failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        }
    };

    const getLoansHistory = async () => {
        try {
            const res = await loanService.getLoanHistory();
            if (res.success) {
                return res.data;
            } else {
                Toast.show({ type: 'error', text1: 'Failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        }
    };


    const repayLoan = async ( amount: number) => {
        try {
            const res = await loanService.repayLoan( amount);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Repayment successful' });
                return res.data;
            } else {
                Toast.show({ type: 'error', text1: 'Repayment failed', text2: res.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error?.message || 'Unknown error' });
        }
    };




    return {
        applyLoan,
        getLoansHistory,
        repayLoan,

    };
}