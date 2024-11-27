// This file was created with the assistance of GPT-4
import React from "react";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
}

interface Author {
  username: string;
  profile_picture?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags?: Tag[];
  author: Author;
  created_at: string;
  rating: number;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Format the created date using native JavaScript
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(post.created_at);

  return (
    <Link href={`/p/${post.id}`} passHref>
      <div
        className="cursor-pointer bg-[var(--card-background)] text-[var(--text-primary)] 
                   rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {/* Post Title */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">{post.title}</span>
          </div>

          {/* Post Rating */}
          <div className="flex items-center space-x-1">
            <span>⬆</span>
            <span className="text-lg font-bold">{post.rating}</span>
          </div>
        </div>

        {/* Post Content (Truncated) */}
        <div className="mt-4">
          <p className="mb-4">{post.content.substring(0, 100)}...</p>

          {/* Tags */}
          <div className="flex overflow-hidden">
            {post.tags && post.tags.length > 0 ? (
              <div className="flex space-x-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--highlight)] opacity-80"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              // Render empty space to preserve layout
              <div className="h-6"></div>
            )}
          </div>

          {/* Author and Date */}
          <div className="mt-4 flex justify-between items-center">
            {/* Author */}
            <div className="flex items-center space-x-2">
              <img
                // src={post.author.profile_picture || "/api/placeholder/32/32"}
                src={"/incognito.png"}
                alt={post.author.username}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm">{post.author.username}</span>
            </div>

            {/* Date Created */}
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
