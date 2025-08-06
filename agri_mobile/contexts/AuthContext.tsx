import { authService } from '@/api/auth';
import { LoginRequest } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

// Define the auth context type based on what useAuth returns
interface AuthContextType {
    login: (data: any) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    // Load auth state from storage
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const [token, userRole] = await Promise.all([
                    AsyncStorage.getItem('auth_token'),
                    AsyncStorage.getItem('role')
                ]);

                console.log('AuthProvider: Token from storage:', token);
                console.log('AuthProvider: Role from storage:', userRole);



                // Only navigate if we have a token
                if (token) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('AuthProvider: Error loading auth state:', error);
                router.replace('/login');
            }
        };

        loadAuthState();
    }, []);




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
                            // router.push('/admin/admin-dashboard');
                        } else {
                            router.push('/(tabs)/loans/LoanService');
                        }
                    })
                    .catch(error => {
                        console.error('Error storing token:', error);
                        throw new Error('Failed to store authentication token');
                    });
                await AsyncStorage.setItem('role', response.data.role)
                    .then(() => {
                        console.log('Role stored successfully');
                    })
                    .catch(error => {
                        console.error('Error storing role:', error);
                        throw new Error('Failed to store user role');
                    });
            } else {
                console.error('Login failed:', response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            Toast.show({ type: 'error', text1: 'Login failed', text2:  'Unknown error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ loading, login }}>

            {children}
        </AuthContext.Provider>
    );
};

export { useAuth, AuthProvider }