const fs = require('fs');
const path = require('path');

const files = {
  // API
  "src/api/client.ts": "import axios from 'axios';\n\nexport const apiClient = axios.create({\n  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',\n  headers: {\n    'Content-Type': 'application/json',\n  },\n});\n\n// TODO: Add interceptors for JWT\n",
  "src/api/auth.api.ts": "export const authApi = {\n  // TODO: login, register, logout, refreshToken, googleAuth\n};\n",
  "src/api/bookings.api.ts": "export const bookingsApi = {\n  // TODO: CRUD booking endpoints\n};\n",
  "src/api/services.api.ts": "export const servicesApi = {\n  // TODO: CRUD service endpoints\n};\n",
  "src/api/employees.api.ts": "export const employeesApi = {\n  // TODO: CRUD employee endpoints\n};\n",
  "src/api/companies.api.ts": "export const companiesApi = {\n  // TODO: CRUD company endpoints\n};\n",
  "src/api/reviews.api.ts": "export const reviewsApi = {\n  // TODO: CRUD review endpoints\n};\n",
  "src/api/coupons.api.ts": "export const couponsApi = {\n  // TODO: CRUD coupon endpoints\n};\n",
  "src/api/analytics.api.ts": "export const analyticsApi = {\n  // TODO: dashboard data endpoints\n};\n",
  "src/api/subscriptions.api.ts": "export const subscriptionsApi = {\n  // TODO: subscription endpoints\n};\n",
  "src/api/admin.api.ts": "export const adminApi = {\n  // TODO: super admin endpoints\n};\n",

  // Components UI
  "src/components/ui/Button.tsx": "import React from 'react';\nimport { clsx } from 'clsx';\n\ninterface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'outline';\n}\n\n/** Reusable button with variants */\nexport function Button({ variant = 'primary', className, ...props }: ButtonProps) {\n  return (\n    <button className={clsx('px-4 py-2 rounded-md font-medium', className)} {...props} />\n  );\n}\nexport default Button;\n",
  "src/components/ui/Input.tsx": "import React from 'react';\n\ninterface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {\n  label?: string;\n  error?: string;\n}\n\n/** Form input with label and error */\nexport function Input({ label, error, className, ...props }: InputProps) {\n  return (\n    <div className=\"flex flex-col gap-1\">\n      {label && <label className=\"text-sm font-medium\">{label}</label>}\n      <input className=\"border rounded-md px-3 py-2\" {...props} />\n      {error && <span className=\"text-xs text-red-500\">{error}</span>}\n    </div>\n  );\n}\nexport default Input;\n",
  "src/components/ui/Modal.tsx": "import React from 'react';\n\ninterface ModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  children: React.ReactNode;\n}\n\n/** Dialog/modal component */\nexport function Modal({ isOpen, onClose, children }: ModalProps) {\n  if (!isOpen) return null;\n  return (\n    <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center p-4\">\n      <div className=\"bg-white rounded-lg p-6 max-w-md w-full shadow-xl\">\n        {children}\n        <button onClick={onClose} className=\"mt-4 w-full bg-gray-100 py-2 rounded\">Close</button>\n      </div>\n    </div>\n  );\n}\nexport default Modal;\n",
  "src/components/ui/Card.tsx": "import React from 'react';\n\ninterface CardProps extends React.HTMLAttributes<HTMLDivElement> {}\n\n/** Content card */\nexport function Card({ className, children, ...props }: CardProps) {\n  return (\n    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className || ''}`} {...props}>\n      {children}\n    </div>\n  );\n}\nexport default Card;\n",
  "src/components/ui/Badge.tsx": "import React from 'react';\n\ninterface BadgeProps {\n  children: React.ReactNode;\n  status?: 'success' | 'warning' | 'error' | 'info';\n}\n\n/** Status badge */\nexport function Badge({ children, status = 'info' }: BadgeProps) {\n  return (\n    <span className=\"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700\">\n      {children}\n    </span>\n  );\n}\nexport default Badge;\n",
  "src/components/ui/Select.tsx": "import React from 'react';\n\ninterface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {\n  label?: string;\n  options: { label: string; value: string }[];\n}\n\n/** Dropdown select */\nexport function Select({ label, options, className, ...props }: SelectProps) {\n  return (\n    <div className=\"flex flex-col gap-1\">\n      {label && <label className=\"text-sm font-medium\">{label}</label>}\n      <select className=\"border rounded-md px-3 py-2\" {...props}>\n        {options.map((opt) => (\n          <option key={opt.value} value={opt.value}>{opt.label}</option>\n        ))}\n      </select>\n    </div>\n  );\n}\nexport default Select;\n",
  "src/components/ui/Spinner.tsx": "import React from 'react';\n\ninterface SpinnerProps {\n  size?: 'sm' | 'md' | 'lg';\n}\n\n/** Loading spinner */\nexport function Spinner({ size = 'md' }: SpinnerProps) {\n  return (\n    <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600\"></div>\n  );\n}\nexport default Spinner;\n",
  "src/components/ui/Table.tsx": "import React from 'react';\n\ninterface TableProps {\n  children: React.ReactNode;\n}\n\n/** Data table */\nexport function Table({ children }: TableProps) {\n  return (\n    <div className=\"overflow-x-auto\">\n      <table className=\"min-w-full divide-y divide-gray-200\">\n        {children}\n      </table>\n    </div>\n  );\n}\nexport default Table;\n",
  "src/components/ui/Pagination.tsx": "import React from 'react';\n\ninterface PaginationProps {\n  currentPage: number;\n  totalPages: number;\n  onPageChange: (page: number) => void;\n}\n\n/** Pagination controls */\nexport function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {\n  return (\n    <div className=\"flex gap-2 justify-center items-center py-4\">\n      {/* TODO: Add pagination controls */}\n      <span>Page {currentPage} of {totalPages}</span>\n    </div>\n  );\n}\nexport default Pagination;\n",
  "src/components/ui/index.ts": "export * from './Button';\nexport * from './Input';\nexport * from './Modal';\nexport * from './Card';\nexport * from './Badge';\nexport * from './Select';\nexport * from './Spinner';\nexport * from './Table';\nexport * from './Pagination';\n",

  // Components Layout
  "src/components/layout/RootLayout.tsx": "import React from 'react';\nimport { Outlet } from 'react-router-dom';\n\n/** App shell */\nexport function RootLayout() {\n  return (\n    <div className=\"min-h-screen bg-gray-50 text-gray-900\">\n      <Outlet />\n    </div>\n  );\n}\nexport default RootLayout;\n",
  "src/components/layout/Sidebar.tsx": "import React from 'react';\n\n/** Navigation sidebar */\nexport function Sidebar() {\n  return (\n    <aside className=\"w-64 bg-white border-r h-full\">\n      <nav className=\"p-4 space-y-2\">\n        {/* TODO: Add navigation links */}\n        <div>Dashboard</div>\n      </nav>\n    </aside>\n  );\n}\nexport default Sidebar;\n",
  "src/components/layout/Header.tsx": "import React from 'react';\n\n/** Top header with user menu */\nexport function Header() {\n  return (\n    <header className=\"h-16 bg-white border-b flex items-center px-6 justify-between\">\n      <div className=\"font-bold text-xl\">BookingHub</div>\n      <div>User Menu</div>\n    </header>\n  );\n}\nexport default Header;\n",
  "src/components/layout/Footer.tsx": "import React from 'react';\n\n/** Footer component */\nexport function Footer() {\n  return (\n    <footer className=\"bg-gray-900 text-gray-400 py-8 text-center\">\n      <p>© 2026 BookingHub. All rights reserved.</p>\n    </footer>\n  );\n}\nexport default Footer;\n",
  "src/components/layout/DashboardLayout.tsx": "import React from 'react';\nimport { Outlet } from 'react-router-dom';\nimport { Sidebar } from './Sidebar';\nimport { Header } from './Header';\n\n/** Dashboard wrapper */\nexport function DashboardLayout() {\n  return (\n    <div className=\"flex h-screen overflow-hidden\">\n      <Sidebar />\n      <div className=\"flex-1 flex flex-col\">\n        <Header />\n        <main className=\"flex-1 overflow-y-auto p-6 bg-gray-50\">\n          <Outlet />\n        </main>\n      </div>\n    </div>\n  );\n}\nexport default DashboardLayout;\n",
  "src/components/layout/PublicLayout.tsx": "import React from 'react';\nimport { Outlet } from 'react-router-dom';\nimport { Header } from './Header';\nimport { Footer } from './Footer';\n\n/** Public-facing layout */\nexport function PublicLayout() {\n  return (\n    <div className=\"flex flex-col min-h-screen\">\n      <Header />\n      <main className=\"flex-1\">\n        <Outlet />\n      </main>\n      <Footer />\n    </div>\n  );\n}\nexport default PublicLayout;\n",
  "src/components/layout/index.ts": "export * from './RootLayout';\nexport * from './Sidebar';\nexport * from './Header';\nexport * from './Footer';\nexport * from './DashboardLayout';\nexport * from './PublicLayout';\n",

  // Booking Components
  "src/components/booking/BookingWizard.tsx": "import React from 'react';\n\n/** Multi-step booking flow */\nexport function BookingWizard() {\n  return <div>{/* TODO: Implement multi-step wizard */}</div>;\n}\nexport default BookingWizard;\n",
  "src/components/booking/ServiceSelect.tsx": "import React from 'react';\n\nexport function ServiceSelect() {\n  return <div>{/* TODO: Select a service */}</div>;\n}\nexport default ServiceSelect;\n",
  "src/components/booking/EmployeeSelect.tsx": "import React from 'react';\n\nexport function EmployeeSelect() {\n  return <div>{/* TODO: Select an employee */}</div>;\n}\nexport default EmployeeSelect;\n",
  "src/components/booking/DatePicker.tsx": "import React from 'react';\n\nexport function DatePicker() {\n  return <div>{/* TODO: Select a date */}</div>;\n}\nexport default DatePicker;\n",
  "src/components/booking/TimeSlotPicker.tsx": "import React from 'react';\n\nexport function TimeSlotPicker() {\n  return <div>{/* TODO: Select a time slot */}</div>;\n}\nexport default TimeSlotPicker;\n",
  "src/components/booking/BookingConfirmation.tsx": "import React from 'react';\n\nexport function BookingConfirmation() {\n  return <div>{/* TODO: Confirm booking and summary */}</div>;\n}\nexport default BookingConfirmation;\n",
  "src/components/booking/BookingCard.tsx": "import React from 'react';\n\nexport function BookingCard() {\n  return <div>{/* TODO: Display a booking item */}</div>;\n}\nexport default BookingCard;\n",
  "src/components/booking/index.ts": "export * from './BookingWizard';\nexport * from './ServiceSelect';\nexport * from './EmployeeSelect';\nexport * from './DatePicker';\nexport * from './TimeSlotPicker';\nexport * from './BookingConfirmation';\nexport * from './BookingCard';\n",

  // Calendar
  "src/components/calendar/CalendarView.tsx": "import React from 'react';\n\nexport function CalendarView() {\n  return <div>{/* TODO: Main calendar component */}</div>;\n}\nexport default CalendarView;\n",
  "src/components/calendar/DayView.tsx": "import React from 'react';\n\nexport function DayView() {\n  return <div>{/* TODO: Daily schedule view */}</div>;\n}\nexport default DayView;\n",
  "src/components/calendar/WeekView.tsx": "import React from 'react';\n\nexport function WeekView() {\n  return <div>{/* TODO: Weekly schedule view */}</div>;\n}\nexport default WeekView;\n",
  "src/components/calendar/TimeSlot.tsx": "import React from 'react';\n\nexport function TimeSlot() {\n  return <div>{/* TODO: A single block on the calendar */}</div>;\n}\nexport default TimeSlot;\n",
  "src/components/calendar/index.ts": "export * from './CalendarView';\nexport * from './DayView';\nexport * from './WeekView';\nexport * from './TimeSlot';\n",

  // Dashboard
  "src/components/dashboard/StatsCard.tsx": "import React from 'react';\n\nexport function StatsCard() {\n  return <div>{/* TODO: Key metric card */}</div>;\n}\nexport default StatsCard;\n",
  "src/components/dashboard/RevenueChart.tsx": "import React from 'react';\n\nexport function RevenueChart() {\n  return <div>{/* TODO: Revenue line/bar chart using recharts */}</div>;\n}\nexport default RevenueChart;\n",
  "src/components/dashboard/BookingsChart.tsx": "import React from 'react';\n\nexport function BookingsChart() {\n  return <div>{/* TODO: Bookings over time chart */}</div>;\n}\nexport default BookingsChart;\n",
  "src/components/dashboard/TopEmployees.tsx": "import React from 'react';\n\nexport function TopEmployees() {\n  return <div>{/* TODO: List of top performing employees */}</div>;\n}\nexport default TopEmployees;\n",
  "src/components/dashboard/PopularServices.tsx": "import React from 'react';\n\nexport function PopularServices() {\n  return <div>{/* TODO: Most booked services */}</div>;\n}\nexport default PopularServices;\n",
  "src/components/dashboard/RecentBookings.tsx": "import React from 'react';\n\nexport function RecentBookings() {\n  return <div>{/* TODO: Table of latest bookings */}</div>;\n}\nexport default RecentBookings;\n",
  "src/components/dashboard/index.ts": "export * from './StatsCard';\nexport * from './RevenueChart';\nexport * from './BookingsChart';\nexport * from './TopEmployees';\nexport * from './PopularServices';\nexport * from './RecentBookings';\n",

  // Common
  "src/components/common/Rating.tsx": "import React from 'react';\n\n/** Star rating */\nexport function Rating() {\n  return <div>{/* TODO: 5-star rating visual */}</div>;\n}\nexport default Rating;\n",
  "src/components/common/Avatar.tsx": "import React from 'react';\n\nexport function Avatar() {\n  return <div>{/* TODO: User profile picture */}</div>;\n}\nexport default Avatar;\n",
  "src/components/common/SearchBar.tsx": "import React from 'react';\n\nexport function SearchBar() {\n  return <div>{/* TODO: Global search input */}</div>;\n}\nexport default SearchBar;\n",
  "src/components/common/EmptyState.tsx": "import React from 'react';\n\nexport function EmptyState() {\n  return <div>{/* TODO: No data to display visual */}</div>;\n}\nexport default EmptyState;\n",
  "src/components/common/ErrorBoundary.tsx": "import React from 'react';\n\nexport class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {\n  state = { hasError: false };\n  static getDerivedStateFromError() { return { hasError: true }; }\n  render() {\n    if (this.state.hasError) return <div>Something went wrong.</div>;\n    return this.props.children;\n  }\n}\nexport default ErrorBoundary;\n",
  "src/components/common/ProtectedRoute.tsx": "import React from 'react';\nimport { Navigate, Outlet } from 'react-router-dom';\n\nexport function ProtectedRoute() {\n  const isAuthenticated = true; // TODO: integrate useAuth\n  return isAuthenticated ? <Outlet /> : <Navigate to=\"/login\" />;\n}\nexport default ProtectedRoute;\n",
  "src/components/common/index.ts": "export * from './Rating';\nexport * from './Avatar';\nexport * from './SearchBar';\nexport * from './EmptyState';\nexport * from './ErrorBoundary';\nexport * from './ProtectedRoute';\n",

  // Pages - Auth
  "src/pages/auth/LoginPage.tsx": "import React from 'react';\n\nexport function LoginPage() {\n  return <div>{/* TODO: Login form */}</div>;\n}\nexport default LoginPage;\n",
  "src/pages/auth/RegisterPage.tsx": "import React from 'react';\n\nexport function RegisterPage() {\n  return <div>{/* TODO: Registration form */}</div>;\n}\nexport default RegisterPage;\n",
  "src/pages/auth/ForgotPasswordPage.tsx": "import React from 'react';\n\nexport function ForgotPasswordPage() {\n  return <div>{/* TODO: Request password reset */}</div>;\n}\nexport default ForgotPasswordPage;\n",
  "src/pages/auth/ResetPasswordPage.tsx": "import React from 'react';\n\nexport function ResetPasswordPage() {\n  return <div>{/* TODO: Set new password */}</div>;\n}\nexport default ResetPasswordPage;\n",
  "src/pages/auth/VerifyEmailPage.tsx": "import React from 'react';\n\nexport function VerifyEmailPage() {\n  return <div>{/* TODO: Email verification success/error */}</div>;\n}\nexport default VerifyEmailPage;\n",

  // Pages - Admin
  "src/pages/admin/AdminDashboard.tsx": "import React from 'react';\n\nexport function AdminDashboard() {\n  return <div>{/* TODO: Super admin overview */}</div>;\n}\nexport default AdminDashboard;\n",
  "src/pages/admin/CompaniesManagement.tsx": "import React from 'react';\n\nexport function CompaniesManagement() {\n  return <div>{/* TODO: List and manage tenant companies */}</div>;\n}\nexport default CompaniesManagement;\n",
  "src/pages/admin/PlatformStats.tsx": "import React from 'react';\n\nexport function PlatformStats() {\n  return <div>{/* TODO: Overall platform metrics */}</div>;\n}\nexport default PlatformStats;\n",
  "src/pages/admin/SubscriptionsManagement.tsx": "import React from 'react';\n\nexport function SubscriptionsManagement() {\n  return <div>{/* TODO: Manage SaaS plans and billing */}</div>;\n}\nexport default SubscriptionsManagement;\n",

  // Pages - Company
  "src/pages/company/CompanyDashboard.tsx": "import React from 'react';\n\nexport function CompanyDashboard() {\n  return <div>{/* TODO: Tenant metrics and summary */}</div>;\n}\nexport default CompanyDashboard;\n",
  "src/pages/company/ServicesManagement.tsx": "import React from 'react';\n\nexport function ServicesManagement() {\n  return <div>{/* TODO: CRUD for booking services */}</div>;\n}\nexport default ServicesManagement;\n",
  "src/pages/company/EmployeesManagement.tsx": "import React from 'react';\n\nexport function EmployeesManagement() {\n  return <div>{/* TODO: Manage staff members */}</div>;\n}\nexport default EmployeesManagement;\n",
  "src/pages/company/BookingsManagement.tsx": "import React from 'react';\n\nexport function BookingsManagement() {\n  return <div>{/* TODO: View and manage all company bookings */}</div>;\n}\nexport default BookingsManagement;\n",
  "src/pages/company/CouponsManagement.tsx": "import React from 'react';\n\nexport function CouponsManagement() {\n  return <div>{/* TODO: Discount codes management */}</div>;\n}\nexport default CouponsManagement;\n",
  "src/pages/company/ReviewsPage.tsx": "import React from 'react';\n\nexport function ReviewsPage() {\n  return <div>{/* TODO: View customer feedback */}</div>;\n}\nexport default ReviewsPage;\n",
  "src/pages/company/ReportsPage.tsx": "import React from 'react';\n\nexport function ReportsPage() {\n  return <div>{/* TODO: Advanced analytics and exports */}</div>;\n}\nexport default ReportsPage;\n",
  "src/pages/company/SettingsPage.tsx": "import React from 'react';\n\nexport function SettingsPage() {\n  return <div>{/* TODO: Tenant configuration (hours, policies) */}</div>;\n}\nexport default SettingsPage;\n",

  // Pages - Employee
  "src/pages/employee/EmployeeDashboard.tsx": "import React from 'react';\n\nexport function EmployeeDashboard() {\n  return <div>{/* TODO: Staff member overview */}</div>;\n}\nexport default EmployeeDashboard;\n",
  "src/pages/employee/EmployeeSchedule.tsx": "import React from 'react';\n\nexport function EmployeeSchedule() {\n  return <div>{/* TODO: Working hours and calendar */}</div>;\n}\nexport default EmployeeSchedule;\n",
  "src/pages/employee/EmployeeBookings.tsx": "import React from 'react';\n\nexport function EmployeeBookings() {\n  return <div>{/* TODO: Upcoming appointments for this employee */}</div>;\n}\nexport default EmployeeBookings;\n",

  // Pages - Customer
  "src/pages/customer/CustomerDashboard.tsx": "import React from 'react';\n\nexport function CustomerDashboard() {\n  return <div>{/* TODO: End-user portal overview */}</div>;\n}\nexport default CustomerDashboard;\n",
  "src/pages/customer/CustomerBookings.tsx": "import React from 'react';\n\nexport function CustomerBookings() {\n  return <div>{/* TODO: User appointment history */}</div>;\n}\nexport default CustomerBookings;\n",
  "src/pages/customer/CustomerProfile.tsx": "import React from 'react';\n\nexport function CustomerProfile() {\n  return <div>{/* TODO: User personal details */}</div>;\n}\nexport default CustomerProfile;\n",

  // Pages - Public
  "src/pages/public/HomePage.tsx": "import React from 'react';\n\nexport function HomePage() {\n  return <div>{/* TODO: Platform landing page */}</div>;\n}\nexport default HomePage;\n",
  "src/pages/public/BusinessPage.tsx": "import React from 'react';\n\nexport function BusinessPage() {\n  return <div>{/* TODO: Public profile for a specific company */}</div>;\n}\nexport default BusinessPage;\n",
  "src/pages/public/BookingPage.tsx": "import React from 'react';\n\nexport function BookingPage() {\n  return <div>{/* TODO: Public booking widget/page */}</div>;\n}\nexport default BookingPage;\n",
  "src/pages/public/PricingPage.tsx": "import React from 'react';\n\nexport function PricingPage() {\n  return <div>{/* TODO: SaaS subscription tiers */}</div>;\n}\nexport default PricingPage;\n",

  // Hooks
  "src/hooks/useAuth.ts": "export function useAuth() {\n  // TODO: Implement auth hook fetching from context/store\n  return { user: null, isAuthenticated: false };\n}\n",
  "src/hooks/useBookings.ts": "export function useBookings() {\n  // TODO: React Query hooks for bookings\n  return {};\n}\n",
  "src/hooks/useServices.ts": "export function useServices() {\n  // TODO: React Query hooks for services\n  return {};\n}\n",
  "src/hooks/useEmployees.ts": "export function useEmployees() {\n  // TODO: React Query hooks for employees\n  return {};\n}\n",
  "src/hooks/useDebounce.ts": "import { useState, useEffect } from 'react';\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}\n",
  "src/hooks/useLocalStorage.ts": "import { useState } from 'react';\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  // TODO: Local storage implementation\n  const [storedValue, setStoredValue] = useState<T>(initialValue);\n  return [storedValue, setStoredValue] as const;\n}\n",
  "src/hooks/usePagination.ts": "import { useState } from 'react';\nexport function usePagination(initialPage = 1) {\n  const [page, setPage] = useState(initialPage);\n  return { page, setPage };\n}\n",

  // Context
  "src/context/AuthContext.tsx": "import React, { createContext, useContext } from 'react';\n\nconst AuthContext = createContext<any>(null);\n\nexport function AuthProvider({ children }: { children: React.ReactNode }) {\n  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;\n}\n\nexport const useAuthContext = () => useContext(AuthContext);\n",
  "src/context/ThemeContext.tsx": "import React, { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext<any>(null);\n\nexport function ThemeProvider({ children }: { children: React.ReactNode }) {\n  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;\n}\n\nexport const useThemeContext = () => useContext(ThemeContext);\n",
  "src/context/TenantContext.tsx": "import React, { createContext, useContext } from 'react';\n\nconst TenantContext = createContext<any>(null);\n\nexport function TenantProvider({ children }: { children: React.ReactNode }) {\n  return <TenantContext.Provider value={{}}>{children}</TenantContext.Provider>;\n}\n\nexport const useTenantContext = () => useContext(TenantContext);\n",

  // Lib
  "src/lib/constants.ts": "export const APP_NAME = 'BookingHub';\n// TODO: Add other app-wide constants\n",
  "src/lib/utils.ts": "import { clsx, type ClassValue } from 'clsx';\nimport { format } from 'date-fns';\n\nexport function cn(...inputs: ClassValue[]) {\n  return clsx(inputs);\n}\n\nexport function formatDate(date: Date | string) {\n  return format(new Date(date), 'MMM d, yyyy');\n}\n\nexport function formatCurrency(amount: number) {\n  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);\n}\n",
  "src/lib/validators.ts": "import { z } from 'zod';\n\nexport const loginSchema = z.object({\n  email: z.string().email(),\n  password: z.string().min(6),\n});\n// TODO: Add other shared Zod schemas\n",

  // Types
  "src/types/auth.types.ts": "export interface User {\n  id: string;\n  email: string;\n  role: 'ADMIN' | 'COMPANY' | 'EMPLOYEE' | 'CUSTOMER';\n}\n",
  "src/types/booking.types.ts": "export interface Booking {\n  id: string;\n  serviceId: string;\n  employeeId: string;\n  customerId: string;\n  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';\n}\n",
  "src/types/service.types.ts": "export interface Service {\n  id: string;\n  name: string;\n  duration: number;\n  price: number;\n}\n",
  "src/types/employee.types.ts": "export interface Employee {\n  id: string;\n  userId: string;\n  companyId: string;\n}\n",
  "src/types/company.types.ts": "export interface Company {\n  id: string;\n  name: string;\n  subdomain: string;\n}\n",
  "src/types/review.types.ts": "export interface Review {\n  id: string;\n  rating: number;\n  comment: string;\n}\n",
  "src/types/coupon.types.ts": "export interface Coupon {\n  id: string;\n  code: string;\n  discountPercentage: number;\n}\n",
  "src/types/common.types.ts": "export interface PaginatedResponse<T> {\n  data: T[];\n  total: number;\n  page: number;\n  limit: number;\n}\n",
  "src/types/index.ts": "export * from './auth.types';\nexport * from './booking.types';\nexport * from './service.types';\nexport * from './employee.types';\nexport * from './company.types';\nexport * from './review.types';\nexport * from './coupon.types';\nexport * from './common.types';\n",

  // Styles
  "src/styles/globals.css": "/* Extra global styles */\n",

  // Assets
  "src/assets/.gitkeep": "",

  // Tailwind css
  "src/index.css": "@import 'tailwindcss';\n@import './styles/globals.css';\n\nbody {\n  @apply bg-gray-50 text-gray-900 antialiased;\n}\n",

  // Vite config update
  "vite.config.ts": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  },\n});\n",
  
  // App.tsx
  "src/App.tsx": "import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { Toaster } from 'react-hot-toast';\n\nimport { AuthProvider } from './context/AuthContext';\nimport { ThemeProvider } from './context/ThemeContext';\n\nimport { RootLayout, DashboardLayout, PublicLayout } from './components/layout';\nimport { ProtectedRoute } from './components/common';\nimport HomePage from './pages/public/HomePage';\nimport LoginPage from './pages/auth/LoginPage';\nimport CompanyDashboard from './pages/company/CompanyDashboard';\n\nconst queryClient = new QueryClient();\n\nfunction App() {\n  return (\n    <QueryClientProvider client={queryClient}>\n      <ThemeProvider>\n        <AuthProvider>\n          <Router>\n            <Routes>\n              <Route element={<RootLayout />}>\n                {/* Public Routes */}\n                <Route element={<PublicLayout />}>\n                  <Route path=\"/\" element={<HomePage />} />\n                  <Route path=\"/login\" element={<LoginPage />} />\n                  {/* TODO: Add other public/auth routes */}\n                </Route>\n\n                {/* Protected Dashboard Routes */}\n                <Route element={<ProtectedRoute />}>\n                  <Route element={<DashboardLayout />}>\n                    <Route path=\"/dashboard\" element={<CompanyDashboard />} />\n                    {/* TODO: Add other protected routes */}\n                  </Route>\n                </Route>\n              </Route>\n            </Routes>\n          </Router>\n          <Toaster position=\"top-right\" />\n        </AuthProvider>\n      </ThemeProvider>\n    </QueryClientProvider>\n  );\n}\n\nexport default App;\n",

  "src/main.tsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n"
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join('c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}

console.log('Scaffolding complete!');
