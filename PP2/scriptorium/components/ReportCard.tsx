import React from "react";

interface ReportCardProps {
  id: number;
  title: string;
  description: string;
  author: string;
  numReports: number;
  onHide: (id: number) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  title,
  description,
  author,
  numReports,
  onHide,
}) => {
  return (
    <div className="cursor-pointer bg-[var(--card-background)] text-[var(--text-primary)] 
    rounded-2xl p-6 shadow-lg transition-transform hover:scale-105 transition-shadow duration-300 mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-700 dark:text-gray-400 mb-2">{description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-500">Author: {author}</p>
      <p className="text-sm text-red-600 dark:text-red-400">Reports: {numReports}</p>
      <button
        onClick={() => onHide(id)}
        className="mt-2 bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
      >
        Hide
      </button>
    </div>
  );
};

export default ReportCard;
