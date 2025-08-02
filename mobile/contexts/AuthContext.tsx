import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect} from 'react';

// Define the auth context type based on what useAuth returns
type AuthContextType = {
    login: (data: any) => Promise<void>;
    loading: boolean;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const auth = useAuth();

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
                    router.replace(userRole === 'ADMIN' ? '/admin-dashboard' : '/(tabs)');
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

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);