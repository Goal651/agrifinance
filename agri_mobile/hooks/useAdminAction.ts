import { adminService } from '@/api/admin';
import { LoanProduct, LoanProductRequest, } from '@/types';

interface UseAdminReturn {
    // Methods
    createLoanProduct: (data: LoanProductRequest) => Promise<LoanProduct | null>;
    updateLoanProduct: (id: string, data: LoanProductRequest) => Promise<LoanProduct | null>;
    deleteLoanProduct: (id: string) => Promise<boolean>;
}

export function useAdminAction(): UseAdminReturn {

    const createLoanProduct = async (data: LoanProductRequest): Promise<LoanProduct | null> => {
        try {
            const res = await adminService.createLoanProduct(data);
            if (res.success) {
                // Refresh the loan products list

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
                // setLoanProducts(prev => prev.filter(product => product.id !== id));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting loan product:', error);
            return false;
        }
    };


    return {
        createLoanProduct,
        updateLoanProduct,
        deleteLoanProduct
    }

}