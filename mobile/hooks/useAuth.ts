import { authService } from '@/api/auth';
import { LoginRequest } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';


export function useAuth() {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(data);
            console.log('Login response:', response);
            
            if (response.success && response.data?.token) {
                // Store token first
                await AsyncStorage.setItem('auth_token', response.data.token)
                    .then(async () => {
                        console.log('Token stored successfully');
                        Toast.show({ type: 'success', text1: 'Login successful' });
                        // Wait for token to be stored before navigating
                        await new Promise(resolve => setTimeout(resolve, 100));
                        if (response.data.role === 'ADMIN') {
                            router.push('/admin-dashboard');
                        } else {
                            router.push('/(tabs)');
                        }
                    })
                    .catch(error => {
                        console.error('Error storing token:', error);
                        throw new Error('Failed to store authentication token');
                    });
            } else {
                console.error('Login failed:', response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            Toast.show({ type: 'error', text1: 'Login failed', text2: error?.message || 'Unknown error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
}