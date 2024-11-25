// This file was created with the assistance of GPT-4
import React from "react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  title: string;
  author: string;
  summary: string;
  tags: string[];
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, author, summary, tags }) => {
  return (
    <div className="p-4 bg-[var(--card-background)] text-[var(--text-primary)] rounded shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-2">By: {author}</p>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {summary.length > 100 ? `${summary.slice(0, 100)}...` : summary}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-[var(--highlight)] text-[var(--text-primary)] px-2 py-1 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        to={`/blog/${id}`}
        className="text-sm text-white bg-[var(--text-primary)] px-4 py-2 rounded hover:bg-[var(--button-hover)]"
      >
        Read More
      </Link>
    </div>
  );
};

export default BlogCard;
