import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User } from './user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string) => {
        return await fetch(`${import.meta.env.VITE_API_URL}/api/login?useCookies=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
    };

    const register = async (email: string, password: string) => {
        return await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
    };

    const getMe = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/manage/info`, {
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
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
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, getMe }}>
            {children}
        </AuthContext.Provider>
    );
}
