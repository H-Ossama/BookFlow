import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect browser to backend Google login route
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0c10] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.05)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.03)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      <div className="relative w-full max-w-md space-y-8 bg-[#121620]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl shadow-[#000000]/50">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#c5a880]/10 text-[#c5a880] mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-serif">
            BookingHub
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your appointments
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/5 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-gray-400 hover:text-[#c5a880] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`block w-full rounded-lg border bg-[#1a202c]/50 py-3 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors duration-200 ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-white/5 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative flex w-full justify-center items-center rounded-lg bg-[#c5a880] py-3 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/50 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0a0c10] border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-x-0 h-px bg-white/5"></div>
          <span className="relative px-4 bg-[#121620] text-xs uppercase tracking-wider text-gray-500">
            Or continue with
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full justify-center items-center rounded-lg border border-white/5 bg-[#1a202c]/30 hover:bg-[#1a202c]/70 py-3 text-sm font-medium text-white transition-colors cursor-pointer"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-[#c5a880] hover:text-[#d6ba93] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

