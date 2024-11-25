// This file was created with the assistance of GPT-4
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationRange = () => {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {/* Previous Button */}
      <button
        className={`px-3 py-1 text-sm rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[var(--text-primary)] text-white hover:bg-[var(--button-hover)]"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {getPaginationRange().map((page) => (
        <button
          key={page}
          className={`px-3 py-1 text-sm rounded ${
            page === currentPage
              ? "bg-[var(--highlight)] text-[var(--text-primary)]"
              : "bg-[var(--card-background)] text-[var(--text-primary)] hover:bg-[var(--button-hover)]"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-3 py-1 text-sm rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[var(--text-primary)] text-white hover:bg-[var(--button-hover)]"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
