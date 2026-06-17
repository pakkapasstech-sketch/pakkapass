import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineDocumentText,
} from 'react-icons/hi';

import '../../styles/contact-admin.css';

const ContactAdminPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      role: '',
      message: '',
    },
  });

  const submitAccessRequest = async () => {
    setLoading(true);
    try {
      // Placeholder API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Request submitted successfully. Administrator will contact you shortly.');
      navigate('/login');
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    submitAccessRequest();
  };

  return (
    <div className="contact-admin-page">
      <motion.div
        className="contact-admin-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          type="button"
          className="back-link"
          onClick={() => navigate('/login')}
        >
          <HiOutlineArrowLeft />
          Back to Login
        </button>

        <h2>Contact Administrator</h2>
        <p className="subtitle">Request access to your PakkaPass account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <HiOutlineUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name *"
              {...register('fullName', { required: 'Full Name is required' })}
            />
          </div>
          {errors.fullName && <span className="error">{errors.fullName.message}</span>}

          <div className="input-group">
            <HiOutlineMail className="input-icon" />
            <input
              type="email"
              placeholder="Email Address *"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
            />
          </div>
          {errors.email && <span className="error">{errors.email.message}</span>}

          <div className="input-group">
            <HiOutlinePhone className="input-icon" />
            <input
              type="tel"
              placeholder="Mobile Number *"
              {...register('mobile', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Enter a valid 10-digit mobile number',
                },
              })}
            />
          </div>
          {errors.mobile && <span className="error">{errors.mobile.message}</span>}

          <div className="input-group">
            <HiOutlineDocumentText className="input-icon" />
            <select
              {...register('role', { required: 'Role is required' })}
              defaultValue=""
            >
              <option value="" disabled>
                Role Required *
              </option>
              <option value="parent">Parent</option>
              <option value="partner">Partner</option>
            </select>
          </div>
          {errors.role && <span className="error">{errors.role.message}</span>}

          <div className="input-group">
            <textarea
              placeholder="Message *"
              rows={4}
              {...register('message', { required: 'Message is required' })}
            />
          </div>
          {errors.message && <span className="error">{errors.message.message}</span>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : 'Request Access'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactAdminPage;