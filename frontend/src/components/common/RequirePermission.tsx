import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface RequirePermissionProps {
  permission?: string;
  children: ReactNode;
}

const rolePermissions: Record<string, string[]> = {
  CUSTOMER: ['my-bookings', 'settings'],
};

export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;

  // SUPER_ADMIN and COMPANY_ADMIN have full access
  if (user.role === 'SUPER_ADMIN' || user.role === 'COMPANY_ADMIN') {
    return <>{children}</>;
  }

  // CUSTOMER — only allowed on specific routes
  if (user.role === 'CUSTOMER') {
    const allowed = rolePermissions.CUSTOMER || [];
    if (permission && allowed.includes(permission)) return <>{children}</>;
    if (!permission) return <>{children}</>;
    return <Navigate to="/unauthorized" replace />;
  }

  // EMPLOYEE — check companyRole permissions
  if (user.role === 'EMPLOYEE') {
    if (!permission) return <>{children}</>;
    const perms = user.companyRole?.permissions || [];
    if (perms.includes(permission)) return <>{children}</>;
    return <Navigate to="/unauthorized" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}
