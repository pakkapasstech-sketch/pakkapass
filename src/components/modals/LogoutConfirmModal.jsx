import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import Modal from '../modals/Modal';
import '../../styles/logoutModal.css'
const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
  >
    <div className="logout-modal-content">
      <div className="logout-icon">
        <HiOutlineExclamationTriangle />
      </div>

      <h2 className="logout-title">
        Logout from PakkaPass?
      </h2>

      <p className="logout-modal-text">
        Are you sure you want to logout
        from your account? You can sign
        in again anytime.
      </p>

      <div className="logout-modal-actions">
        <button
          type="button"
          className="logout-cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="button"
          className="logout-confirm-btn"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? 'Logging out...'
            : 'Logout'}
        </button>
      </div>
    </div>
  </Modal>
);

export const useLogoutConfirm = () => {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const showLogoutConfirm = () =>
    setOpen(true);

  const hideLogoutConfirm = () =>
    setOpen(false);

  const confirmLogout = async (
    logoutFn,
    navigate
  ) => {
    try {
      setLoading(true);

      await logoutFn();

      toast.success(
        'Logged out successfully'
      );

      navigate('/login');
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return {
    open,
    loading,
    showLogoutConfirm,
    hideLogoutConfirm,
    confirmLogout,
    setOpen,
  };
};

export default LogoutConfirmModal;