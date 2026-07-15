import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { type User } from './user';
import { apiClient, setAccessToken } from '../../api/client';

interface AccessTokenResponse {
    accessToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [, setAccessTokenState] = useState<string | null>(null);

    const applyAccessToken = (token: string | null) => {
        setAccessTokenState(token);
        setAccessToken(token);
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const { accessToken } = await res.clone().json() as AccessTokenResponse;
            applyAccessToken(accessToken);
        }

        return res;
    };

    const register = async (email: string, password: string) => {
        return await fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
    };

    const getMe = async () => {
        setUser(await apiClient.get<User>('/manage/info'));
    };

    const logout = async () => {
        await apiClient.post('/logout').catch(() => undefined);
        applyAccessToken(null);
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
