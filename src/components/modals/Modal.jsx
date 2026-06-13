import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import '../../styles/modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const sizes = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay-wrapper">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`modal-container ${sizes[size]}`}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="modal-close-btn"
              >
                <HiOutlineX className="modal-close-icon" />
              </button>
            </div>

            <div className="modal-content">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;