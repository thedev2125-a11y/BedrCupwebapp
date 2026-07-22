import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function RequireAdminAuth() {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
