import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from 'react-icons/hi';

import { useAuth } from '../../contexts/AuthContext';

import logo from '../../assets/PP Final Logo Tagline White 02 1.svg';

import '../../styles/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await login({
        ...data,
        role,
      });

      toast.success('Welcome Back!');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}

      <div className="login-left">
        <div className="brand">
          <img src={logo} alt="PakkaPass" className="brand-logo" />
        </div>

        <div className="hero-content">
          <h1>
            One Platform.
            <br />
            <span>Every Learner. Every Role.</span>
          </h1>

          <p>
            PakkaPass brings students, parents, partners and institutions together on a unified
            platform for smarter learning and management.
          </p>

          <div className="feature-list">
            <div className="feature">
              <HiOutlineChartBar />

              <div>
                <h4>Smart Analytics</h4>

                <p>Real-time insights and reports</p>
              </div>
            </div>

            <div className="feature">
              <HiOutlineShieldCheck />

              <div>
                <h4>Secure & Reliable</h4>

                <p>Enterprise-grade security</p>
              </div>
            </div>

            <div className="feature">
              <HiOutlineUserGroup />

              <div>
                <h4>Role Based Access</h4>

                <p>Admins, Partners & Parents</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview 

          <div className="dashboard-preview">
            <img
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
            />
          </div>*/}
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="login-right">
        <motion.div
          className="login-card"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <h2>Welcome Back!</h2>

          <p className="subtitle">Sign in to continue to your PakkaPass dashboard</p>

          {/* Role Switch */}

          <div className="role-tabs">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={role === 'admin' ? 'active-role' : ''}
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => setRole('partner')}
              className={role === 'partner' ? 'active-role' : ''}
            >
              Partner
            </button>

            <button
              type="button"
              onClick={() => setRole('parent')}
              className={role === 'parent' ? 'active-role' : ''}
            >
              Parent
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}

            <div className="input-group">
              <HiOutlineMail className="input-icon" />

              <input
                type="email"
                placeholder="Email Address"
                {...register('email', {
                  required: 'Email is required',
                })}
              />
            </div>

            {errors.email && <span className="error">{errors.email.message}</span>}

            {/* PASSWORD */}

            <div className="input-group">
              <HiOutlineLockClosed className="input-icon" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                })}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>

            {errors.password && <span className="error">{errors.password.message}</span>}

            {/* OPTIONS */}

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgot-link">
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}

            <button type="submit" disabled={loading} className="signin-btn">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            {/* GOOGLE */}

            <button type="button" className="google-btn">
              Continue with Google
            </button>
          </form>

          <p className="contact-admin">
            Don't have an account?
            <span> Contact your administrator</span>
          </p>
        </motion.div>
        <div className="login-footer-bar">
          <div className="secure-login">
            <HiOutlineShieldCheck />
            <span>Secure Login</span>
          </div>

          <div className="footer-separator"></div>

          <p className="footer-text">
            By continuing, you agree to our
            <span> Terms of Service </span>
            and
            <span> Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
