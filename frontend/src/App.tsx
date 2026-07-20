import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { RootLayout, DashboardLayout, PublicLayout } from './components/layout';
import { ProtectedRoute } from './components/common';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import CompanyDashboard from './pages/company/CompanyDashboard';
import SettingsPage from './pages/company/SettingsPage';
import ServicesManagement from './pages/company/ServicesManagement';
import EmployeesManagement from './pages/company/EmployeesManagement';
import BookingsManagement from './pages/company/BookingsManagement';
import ReviewsPage from './pages/company/ReviewsPage';
import CouponsManagement from './pages/company/CouponsManagement';
import SubscriptionPage from './pages/company/SubscriptionPage';
import CompaniesListPage from './pages/public/CompaniesListPage';
import BookingPage from './pages/public/BookingPage';
import PricingPage from './pages/public/PricingPage';
import { CustomerBookings } from './pages/customer/CustomerBookings';
import ReportsPage from './pages/company/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { ErrorBoundary } from './components/common';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route element={<RootLayout />}>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/book/:slug" element={<BookingPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/companies" element={<CompaniesListPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<ErrorBoundary><CompanyDashboard /></ErrorBoundary>} />
                    <Route path="/dashboard/settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
                    <Route path="/dashboard/services" element={<ErrorBoundary><ServicesManagement /></ErrorBoundary>} />
                    <Route path="/dashboard/employees" element={<ErrorBoundary><EmployeesManagement /></ErrorBoundary>} />
                    <Route path="/dashboard/bookings" element={<ErrorBoundary><BookingsManagement /></ErrorBoundary>} />
                    <Route path="/dashboard/reviews" element={<ErrorBoundary><ReviewsPage /></ErrorBoundary>} />
                    <Route path="/dashboard/coupons" element={<ErrorBoundary><CouponsManagement /></ErrorBoundary>} />
                    <Route path="/dashboard/subscription" element={<ErrorBoundary><SubscriptionPage /></ErrorBoundary>} />
                    <Route path="/dashboard/my-bookings" element={<ErrorBoundary><CustomerBookings /></ErrorBoundary>} />
                    <Route path="/dashboard/reports" element={<ErrorBoundary><ReportsPage /></ErrorBoundary>} />
                  </Route>
                </Route>

                {/* 404 Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
