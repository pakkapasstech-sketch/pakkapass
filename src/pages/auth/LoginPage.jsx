import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: 'superadmin@pakkapass.com', password: 'admin123' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-main-bg)] p-4">
      <button onClick={toggleTheme} className="fixed top-4 right-4 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
        {isDark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-[var(--color-card)]"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <HiOutlineAcademicCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[var(--color-text-primary)]">PakkaPass Admin</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)]">
          Demo: superadmin@pakkapass.com / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
