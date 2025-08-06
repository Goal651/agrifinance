import { userService } from '@/api/user';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export function useUser() {
    const [loading, setLoading] = useState(false);

    const getProfile = async () => {
        setLoading(true);
        try {
            const res = await userService.getProfile();
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Profile loaded' });
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

    const updateProfile = async (data) => {
        setLoading(true);
        try {
            const res = await userService.updateProfile(data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Profile updated' });
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

    return { getProfile, updateProfile, loading };
}
