import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../api/client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  companyId: string | null;
  company?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  oauthLogin: (token: string) => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string; currentPassword?: string; currentEmail?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Perform logout locally
  const handleLocalLogout = () => {
    setAccessToken(null);
    setUser(null);
  };

  // Check refresh token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Axios interceptor handles refreshing access token silently on 401,
        // but we trigger an explicit refresh request on mount to recover session.
        const response = await apiClientPostRefresh();
        if (response?.accessToken) {
          setAccessToken(response.accessToken);
          const data = await authApi.getMe();
          setUser(data.user);
        }
      } catch (err) {
        // No active session
        handleLocalLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for global unauthorized events (e.g. from Axios response interceptor)
    const handleUnauthorized = () => {
      handleLocalLogout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Helper to post refresh token during initial checks
  const apiClientPostRefresh = async () => {
    try {
      // Use raw axios to prevent infinite 401 interceptor loop during check
      const { apiClient } = await import('../api/client');
      const response = await apiClient.post('/auth/refresh-token');
      return response.data.data;
    } catch {
      return null;
    }
  };

  // Login handler
  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      handleLocalLogout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (regData: any) => {
    setIsLoading(true);
    try {
      // Note: Backend register sends confirmation email.
      // In a real sandbox, we automatically log them in or redirect to verification notice.
      await authApi.register(regData);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error on backend', err);
    } finally {
      handleLocalLogout();
      setIsLoading(false);
    }
  };

  // Update profile handler
  const updateProfile = async (data: { firstName?: string; lastName?: string; email?: string; currentPassword?: string; currentEmail?: string }) => {
    try {
      const result = await authApi.updateProfile(data);
      if (result.user) setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  // OAuth login handler
  const oauthLogin = async (token: string) => {
    setIsLoading(true);
    try {
      setAccessToken(token);
      const data = await authApi.getMe();
      setUser(data.user);
    } catch (error) {
      handleLocalLogout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        oauthLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

