// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';

interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {

}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children: ReactNode }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        isLoading: true
    });

    // Initialize auth state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setAuthState({
                    isAuthenticated: true,
                    user: data.user,
                    isLoading: false
                });
            } catch (error) {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false
                });
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ ...authState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);