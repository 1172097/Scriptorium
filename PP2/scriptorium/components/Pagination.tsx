// This file was created with the assistance of GPT-4
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-gray-300 rounded-lg ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400"
            : "hover:bg-gray-200 text-gray-900"
        }`}
      >
        Previous
      </button>
      <span className="text-sm text-gray-900 dark:text-gray-100">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-gray-300 rounded-lg ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400"
            : "hover:bg-gray-200 text-gray-900"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
