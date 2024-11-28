import React, { useState } from "react";

interface Author {
  username: string;
  profile_picture?: string;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  author: Author;
}

interface CommentCardProps {
  comment: Comment;
  handleVote: (commentId: number, vote: number) => void;
  fetchReplies: (commentId: number) => Promise<Comment[]>; // Function to fetch replies
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, handleVote, fetchReplies }) => {
  const [replies, setReplies] = useState<Comment[] | null>(null); // Replies state
  const [loadingReplies, setLoadingReplies] = useState(false); // Loading state

  return (
    <div className="pl-4 border-l border-gray-300 dark:border-gray-700 mb-4">
      {/* Comment Header */}
      <div className="flex items-center mb-2">
        <img
          src={comment.author.profile_picture || "/incognito.png"}
          alt={comment.author.username}
          className="h-8 w-8 rounded-full mr-2"
        />
        <span className="font-semibold text-sm text-[var(--text-primary)]">
          {comment.author.username}
        </span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>

      {/* Comment Content */}
      <p className="text-sm mb-2 text-[var(--text-secondary)]">{comment.content}</p>

      {/* Voting Section */}
      <div className="flex items-center space-x-1">
        <button
          className="text-[var(--text-primary)] text-lg transition-colors bg-transparent border-none p-0 cursor-pointer"
          onClick={() => handleVote(comment.id, 1)}
        >
          ⬆
        </button>
        <span className="text-sm font-bold text-[var(--text-primary)]">{comment.rating}</span>
        <button
          className="text-[var(--text-primary)] text-lg transition-colors bg-transparent border-none p-0 cursor-pointer"
          onClick={() => handleVote(comment.id, -1)}
        >
          ⬇
        </button>
      </div>

      {/* Replies Section */}
        <div className="mt-4">
          {loadingReplies ? (
            <div className="text-sm text-gray-500">Loading replies...</div>
          ) : (
            replies &&
            replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                handleVote={handleVote}
                fetchReplies={fetchReplies} // Pass down the fetchReplies function
              />
            ))
          )}
        </div>
    </div>
  );
};

export default CommentCard;
