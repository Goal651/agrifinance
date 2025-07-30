import { useAuth } from '@/hooks/useAuth';
import React, { createContext, useContext } from 'react';

// Define the auth context type based on what useAuth returns
type AuthContextType = {
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    loading: boolean;
} | null;

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);