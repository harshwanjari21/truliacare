import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Pagination.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrev,
  showFirstLast = true 
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of current page
    
    for (let i = Math.max(1, currentPage - delta); 
         i <= Math.min(totalPages, currentPage + delta); 
         i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination Navigation">
      {/* First page */}
      {showFirstLast && currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={styles.pageButton}
            aria-label="Go to first page"
          >
            1
          </button>
          {currentPage > 4 && <span className={styles.ellipsis}>…</span>}
        </>
      )}

      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={styles.navButton}
        aria-label="Go to previous page"
      >
        <FiChevronLeft size={16} />
        Previous
      </button>

      {/* Page numbers */}
      <div className={styles.pageNumbers}>
        {generatePageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ''
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={styles.navButton}
        aria-label="Go to next page"
      >
        Next
        <FiChevronRight size={16} />
      </button>

      {/* Last page */}
      {showFirstLast && currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className={styles.ellipsis}>…</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={styles.pageButton}
            aria-label="Go to last page"
          >
            {totalPages}
          </button>
        </>
      )}
    </nav>
  );
};

export default Pagination;