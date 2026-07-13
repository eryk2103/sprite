const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
    status: number;

    constructor(status: number) {
        super(`Request failed with status ${status}`);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: 'include',
        ...options,
        headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers,
    });

    if (!res.ok) {
        throw new ApiError(res.status);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(path: string): Promise<T> => request<T>(path),
    post: <T>(path: string, body?: unknown): Promise<T> =>
        request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown): Promise<T> =>
        request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
    delete: <T = void>(path: string): Promise<T> => request<T>(path, { method: 'DELETE' }),
};
