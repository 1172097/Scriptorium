import React from "react";

interface ReportCardProps {
  id: number;
  title: string;
  description: string;
  author: string;
  numReports: number;
  reports: any[];
  onReport: (reports: any[]) => void;
  onHide: (id: number) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  title,
  description,
  author,
  numReports,
  reports,
  onReport,
  onHide,
}) => {
  return (
    <div className="cursor-pointer bg-[var(--card-background)] text-[var(--text-primary)] 
    rounded-2xl p-6 shadow-lg transition-transform hover:scale-105 transition-shadow duration-300 mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-700 dark:text-gray-400 mb-2">{description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-500">Author: {author}</p>
      <p className="text-sm text-red-600 dark:text-red-400">Reports: {numReports}</p>
      {/* Hide button */}
      <button
          className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent mr-2"
          onClick={() => onHide(id)}
        >
          <span className="hover:text-[var(--text-secondary)] text-[var(--text-primary)]">
            Hide
          </span>
      </button>

      {/* Detail Button */}
      <button
          className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
          onClick={() => onReport(reports)}
        >
          <span className="hover:text-[var(--text-secondary)] text-[var(--text-primary)]">
            Detail
          </span>
      </button>
    </div>
  );
};

export default ReportCard;
