import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
  HiOutlineDeviceMobile,
  HiOutlineKey,
} from 'react-icons/hi';

import { useAuth } from '../../auth/AuthProvider';
import { getDefaultRoute } from '../../config/menu.config';
import logo from '../../assets/PP Final Logo Tagline White 02 1.svg';
import '../../styles/login.css';

const OTP_COOLDOWN = 60;

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin, sendOtp, verifyOtp, isAuthenticated, user, loading: authLoading } = useAuth();

  const [role, setRole] = useState('admin');
  const [step, setStep] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
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
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    resetOtpFlow();
  };

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

  const onSendOtp = async (e) => {
    e?.preventDefault();
    if (!mobile || mobile.length < 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    try {
      setLoading(true);
      await sendOtp({ mobile, role });
      setStep('otp');
      setCooldown(OTP_COOLDOWN);
      toast.success('OTP sent to your mobile');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (cooldown > 0) return;
    await onSendOtp();
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Enter the 4-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const result = await verifyOtp({ mobile, otp, role, rememberMe });
      toast.success(`Welcome back, ${result.user.name || 'User'}!`);
      navigate(getDefaultRoute(result.user.role));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const isOtpRole = role === 'partner' || role === 'parent';

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
            {['admin', 'partner', 'parent'].map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={role === r}
                onClick={() => handleRoleChange(r)}
                className={role === r ? 'active-role' : ''}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {role === 'admin' ? (
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
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {step === 'credentials' ? (
                  <form onSubmit={onSendOtp}>
                    <div className="input-group">
                      <HiOutlineDeviceMobile className="input-icon" />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        aria-label="Mobile number"
                        maxLength={10}
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
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={onVerifyOtp}>
                    <p className="otp-sent-msg">
                      OTP sent to <strong>+91 {mobile}</strong>
                      <button type="button" className="change-mobile-btn" onClick={resetOtpFlow}>
                        Change
                      </button>
                    </p>

                    <div className="input-group">
                      <HiOutlineKey className="input-icon" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 4-digit OTP"
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
                        <button type="button" onClick={onResendOtp} disabled={loading}>
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="signin-btn">
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="contact-admin">
            Don&apos;t have an account?
            <span> Contact your administrator</span>
          </p>
        </motion.div>

        <div className="login-footer-bar">
          <div className="secure-login">
            <HiOutlineShieldCheck />
            <span>Secure Login</span>
          </div>

          <span className="footer-dot">•</span>

          <p className="footer-text">
            By continuing, you agree to our
            <span> Terms of Service</span>
            <span> & Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
