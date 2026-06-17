import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../modals/Modal';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
    <p className="logout-modal-text">Are you sure you want to logout?</p>
    <div className="logout-modal-actions">
      <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
        Cancel
      </button>
      <button type="button" className="btn-danger" onClick={onConfirm} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  </Modal>
);

export const useLogoutConfirm = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showLogoutConfirm = () => setOpen(true);
  const hideLogoutConfirm = () => setOpen(false);

  const confirmLogout = async (logoutFn, navigate) => {
    try {
      setLoading(true);
      await logoutFn();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return { open, loading, showLogoutConfirm, hideLogoutConfirm, confirmLogout, setOpen };
};

export default LogoutConfirmModal;
