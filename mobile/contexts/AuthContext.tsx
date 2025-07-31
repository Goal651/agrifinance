import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the auth context type based on what useAuth returns
type AuthContextType = {
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    loading: boolean;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [authToken, setAuthToken] = useState<string | null>(null);
    const auth = useAuth();

    useEffect(() => {

        AsyncStorage.getItem('auth_token')
            .then(token => {
                console.log('AuthProvider: Token from storage:', token);
                setAuthToken(token || null);
                if (!token) router.push('/login');
            })
            .catch(error => {
                console.error('AuthProvider: Error getting token:', error);
                setAuthToken(null);
                router.push('/login');
            });
    }, [router]);




    // Update auth token when login is successful
    useEffect(() => {
        if (auth.loading === false && authToken === null) {
            AsyncStorage.getItem('auth_token').then(token => {
                setAuthToken(token || null);
            });
        }
    }, [auth.loading, authToken, router]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);