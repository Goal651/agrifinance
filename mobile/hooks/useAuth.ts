import { authService } from '@/api/auth';
import { LoginRequest, SignupRequest } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';


export function useAuth() {
    const [loading, setLoading] = useState(false);
    const router=useRouter()

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(data);
            if(response.success) {
             
                await AsyncStorage.setItem('auth_token', response.data.token);
                Toast.show({ type: 'success', text1: 'Login successful' });
                router.push('/(tabs)')
            } else {
                Toast.show({ type: 'error', text1: 'Login failed', text2: response.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Login failed', text2: error?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const signup = async (data: SignupRequest) => {
        setLoading(true);
        try {
            const response = await authService.signup(data);
            if(response.success) {
                await AsyncStorage.setItem('auth_token', response.data.token);
                Toast.show({ type: 'success', text1: 'Account created successfully' });
                router.push('/(tabs)');
            } else {
                Toast.show({ type: 'error', text1: 'Signup failed', text2: response.message });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Signup failed', text2: error?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    return { login, signup, loading };
}