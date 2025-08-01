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
    const [role, setRole] = useState<string | null>(null);
    const auth = useAuth();

    useEffect(() => {

        AsyncStorage.getItem('auth_token')
            .then(token => {
                console.log('AuthProvider: Token from storage:', token);
                setAuthToken(token || null)
            })
            .catch(error => {
                console.error('AuthProvider: Error getting token:', error);
                setAuthToken(null);
            });
        AsyncStorage.getItem('role')
            .then(role => {
                console.log('AuthProvider: Role from storage:', role);
                setRole(role || null)
            })
            .catch(error => {
                console.error('AuthProvider: Error getting role:', error);
                setRole(null);
            });
    }, [router]);


useEffect(() => {
    if (authToken) {
        router.replace(role === 'ADMIN' ? '/admin-dashboard' : '/(tabs)');
    }
}, [authToken, router, role]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);