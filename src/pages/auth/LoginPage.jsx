import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineKey,
} from 'react-icons/hi';

import { useAuth } from '../../auth/AuthProvider';
import { getDefaultRoute } from '../../config/menu.config';
import logo from '../../assets/PP Final Logo Tagline White 02 1.svg';
import '../../styles/login.css';
import Loader from '../../components/common/Loader';

const OTP_COOLDOWN = 60;

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin, sendOtp, verifyOtp, isAuthenticated, user, loading: authLoading } = useAuth();
  const [role, setRole] = useState('admin');
  const [step, setStep] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const prevRole = useRef(role);

  const isAdmin = role === 'admin';
  const isParent = role === 'parent';
  const isPartner = role === 'partner';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resetOtpFlow = useCallback(() => {
    setStep('credentials');
    setOtp('');
    setCooldown(0);
    setEmail('');
   
  }, []);

  useEffect(() => {
    if (prevRole.current !== role) {
      resetOtpFlow();
      prevRole.current = role;
    }
  }, [role, resetOtpFlow]);

  if (!authLoading && isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  const onAdminSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await loginAdmin({ ...data, rememberMe });
      toast.success(`Welcome back, ${result.user.name || 'Admin'}!`);
      navigate(getDefaultRoute(result.user.role));
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGetOTP = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const emailVal = email || getValues('email');

      if (!emailVal || !emailVal.includes('@')) {
        toast.error('Enter a valid email address');
        return;
      }

      await sendOtp({
        role,
        email: emailVal,
      });

      toast.success('OTP sent to your email');

      setStep('otp');
      setCooldown(OTP_COOLDOWN);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    await handleGetOTP();
  };

  const handleOTPLogin = async (e) => {
    e?.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error('OTP is required');
      return;
    }

    try {
      setLoading(true);

      const result = await verifyOtp({
        role,
        email,
        otp,
        rememberMe,
      });

      toast.success(`Welcome back, ${result.user.name || 'User'}!`);

      navigate(getDefaultRoute(result.user.role));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isAdmin) return loading ? 'Logging In...' : 'Login';
    if (isParent && step === 'credentials') return loading ? 'Sending OTP...' : 'Get OTP';
    return loading ? 'Verifying...' : 'Login';
  };
  if (loading || authLoading) {
    return <Loader />;
  }
  return (
    <div className="login-page">
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
        </div>
      </div>

      <div className="login-right">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Welcome Back!</h2>
          <p className="subtitle">Sign in to continue to your PakkaPass dashboard</p>

          <div className="role-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'admin'}
              onClick={() => setRole('admin')}
              className={role === 'admin' ? 'active-role' : ''}
            >
              Admin
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'parent'}
              onClick={() => setRole('parent')}
              className={role === 'parent' ? 'active-role' : ''}
            >
              Parent
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'partner'}
              onClick={() => setRole('partner')}
              className={role === 'partner' ? 'active-role' : ''}
            >
              Partner
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isAdmin ? (
              <motion.form
                key="admin-form"
                onSubmit={handleSubmit(onAdminSubmit)}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="input-group">
                  <HiOutlineMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    aria-label="Email"
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
                {errors.email && <span className="error">{errors.email.message}</span>}

                <div className="input-group">
                  <HiOutlineLockClosed className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    aria-label="Password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.password && <span className="error">{errors.password.message}</span>}

                <div className="login-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                </div>

                <button type="submit" disabled={loading} className="signin-btn">
                  {getButtonText()}
                </button>
              </motion.form>
            ) : isParent || isPartner ? (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {step === 'credentials' ? (
                  <form onSubmit={handleGetOTP}>
                    <div className="input-group">
                      <HiOutlineMail className="input-icon" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email"
                      />
                    </div>

                    <div className="login-options">
                      <label>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="signin-btn">
                      {loading ? 'Sending OTP...' : 'Get OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOTPLogin}>
                    <p className="otp-sent-msg">
                      OTP sent to <strong>{email}</strong>
                      <button type="button" className="change-mobile-btn" onClick={resetOtpFlow}>
                        Change
                      </button>
                    </p>

                    <div className="input-group">
                      <HiOutlineKey className="input-icon" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        aria-label="OTP"
                        maxLength={4}
                        autoFocus
                      />
                    </div>

                    <div className="otp-resend">
                      {cooldown > 0 ? (
                        <span>Resend OTP in {cooldown}s</span>
                      ) : (
                        <button type="button" onClick={handleResendOTP} disabled={loading}>
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="signin-btn">
                      {loading ? 'Verifying...' : 'Login'}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="partner-coming-soon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p style={{ textAlign: 'center', color: '#6b7280' }}>Partner login coming soon</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isAdmin && (
            <p className="contact-admin">
              Don&apos;t have an account?{' '}
              <Link to="/contact-admin" className="contact-admin-link">
                Contact your administrator
              </Link>
            </p>
          )}
        </motion.div>

        <div className="login-footer-bar">
          <div className="secure-login">
            <HiOutlineShieldCheck />
            <span>Secure Login</span>
          </div>

          <span className="footer-dot">•</span>

          <p className="footer-text">
            By continuing, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="footer-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="footer-link">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
