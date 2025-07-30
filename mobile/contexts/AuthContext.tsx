import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/api/auth';

const AuthContext = createContext<AuthService | null>(null);

export const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);