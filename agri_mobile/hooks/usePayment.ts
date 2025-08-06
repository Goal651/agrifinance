import { paymentService } from '@/api/payment';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export function usePayment() {
    const [loading, setLoading] = useState(false);

    const makePayment = async (data) => {
        setLoading(true);
        try {
            const res = await paymentService.makePayment(data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Payment successful' });
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


    return { makePayment,  loading };
}
