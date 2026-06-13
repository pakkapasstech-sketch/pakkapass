import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import '../../styles/pagination.css';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <p className="pagination-info">
        Page {page} of {totalPages}
      </p>

      <div className="pagination-buttons">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="pagination-btn"
        >
          <HiOutlineChevronLeft className="pagination-icon" />
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="pagination-btn"
        >
          <HiOutlineChevronRight className="pagination-icon" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;