import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';

export default function RequireAuth() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
