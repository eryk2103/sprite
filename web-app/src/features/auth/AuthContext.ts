import { createContext, useContext } from 'react';
import { type User } from './user';

export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<Response>;
    register: (email: string, password: string) => Promise<Response>;
    logout: () => Promise<void>;
    getMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
