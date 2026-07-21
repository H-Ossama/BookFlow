import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Briefcase, Globe, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    phone: z.string().optional(),
    role: z.enum(['COMPANY_ADMIN', 'CUSTOMER']),
    companyName: z.string().optional(),
    companySlug: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'COMPANY_ADMIN') {
      if (!data.companyName || data.companyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company name is required (min 2 chars)',
          path: ['companyName'],
        });
      }
      if (!data.companySlug || !/^[a-z0-9-]+$/.test(data.companySlug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company URL slug is required (alphanumeric and hyphens only)',
          path: ['companySlug'],
        });
      }
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: signup } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'COMPANY_ADMIN'>('CUSTOMER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const watchRole = watch('role');

  const handleRoleChange = (role: 'CUSTOMER' | 'COMPANY_ADMIN') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(data);
      setRegisteredEmail(data.email);
      setIsRegistered(true);
      toast.success('Registration successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="bf-auth-page" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`); }}>
        <video className="bf-auth-video" autoPlay muted loop playsInline aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" /></video><div className="bf-auth-overlay" aria-hidden="true" />
        <div className="bf-auth-layout"><div className="bf-auth-intro"><Link to="/" className="bf-auth-brand"><span className="bf-nav-mark" />BookFlow</Link><span className="bf-section-label">YOUR NEXT CHAPTER</span><h1>A clearer way<br /><em>to begin.</em></h1><p>Set up a workspace that gives your customers a thoughtful front door and your team a calmer day.</p></div>
        <div className="bf-auth-card">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a880]/10 text-[#c5a880] mb-4">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold text-white font-serif">Verify your email</h2>
          <p className="mt-4 text-gray-400">
            We sent a verification link to <span className="text-[#c5a880] font-medium">{registeredEmail}</span>.
            Please check your inbox and follow the link to activate your account.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex w-full justify-center rounded-lg bg-[#c5a880] py-3 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-colors"
            >
              Return to login
            </Link>
          </div>
        </div></div>
      </div>
    );
  }

  return (
    <div className="bf-auth-page" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`); }}>
      <video className="bf-auth-video" autoPlay muted loop playsInline aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" /></video><div className="bf-auth-overlay" aria-hidden="true" />
      <div className="bf-auth-layout"><div className="bf-auth-intro"><Link to="/" className="bf-auth-brand"><span className="bf-nav-mark" />BookFlow</Link><span className="bf-section-label">YOUR NEXT CHAPTER</span><h1>A clearer way<br /><em>to begin.</em></h1><p>Set up a workspace that gives your customers a thoughtful front door and your team a calmer day.</p></div>
      <div className="bf-auth-card">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.04)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.04)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      <div className="relative w-full max-w-lg space-y-8 bg-[#121620]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#c5a880]/10 text-[#c5a880] mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-serif">
            Join BookingHub
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Create an account to book services or manage your business
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex p-1 bg-[#1a202c]/50 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => handleRoleChange('CUSTOMER')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              selectedRole === 'CUSTOMER'
                ? 'bg-[#c5a880] text-[#0a0c10] shadow-md font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('COMPANY_ADMIN')}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              selectedRole === 'COMPANY_ADMIN'
                ? 'bg-[#c5a880] text-[#0a0c10] shadow-md font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Business Owner
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('role')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.firstName ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                Last Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.lastName ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.email ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.password ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                  }`}
                  placeholder="•••••••• (Min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#c5a880] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* CONDITIONAL COMPANY FIELDS FOR BUSINESS ADMIN */}
            {watchRole === 'COMPANY_ADMIN' && (
              <>
                {/* Company Name */}
                <div className="sm:col-span-2 transition-all duration-300 ease-in-out">
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                    Business / Company Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      {...register('companyName')}
                      className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                        errors.companyName ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                      }`}
                      placeholder="Grooming Co."
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Company Slug */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                    Preferred Booking URL Slug
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Globe className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      {...register('companySlug')}
                      className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                        errors.companySlug ? 'border-red-500/50' : 'border-white/5 focus:border-[#c5a880]'
                      }`}
                      placeholder="grooming-co"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-gray-500">
                    Your page URL will be: bookinghub.com/slug
                  </p>
                  {errors.companySlug && (
                    <p className="mt-1 text-xs text-red-500">{errors.companySlug.message}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center items-center rounded-lg bg-[#c5a880] py-3 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] focus:outline-none active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0a0c10] border-t-transparent"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-[#c5a880] hover:text-[#d6ba93] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div></div></div>
    </div>
  );
}

export default RegisterPage;
