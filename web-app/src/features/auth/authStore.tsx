import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User } from './user';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<Response>;
    logout: () => Promise<void>;
    getMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string) => {
        return await fetch(`${import.meta.env.VITE_API_URL}/login?useCookies=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
    };

    const getMe = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/manage/info`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('getMe request error');
        }

        const data = await res.json();
        setUser(data);
    };

    const logout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    };

    useEffect(() => {
        getMe()
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, getMe }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
