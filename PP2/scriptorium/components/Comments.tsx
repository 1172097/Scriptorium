// This file was created with the assistance of GPT-4
import React, { useState } from "react";

interface Comment {
  id: string;
  author: string;
  content: string;
  rating: number;
  created_at: string;
  replies?: Comment[];
  numReports: number;
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onVote: (commentId: string, value: number) => void;
  onReport: (commentId: string, reason: string) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, onAddComment, onVote, onReport }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [reportReason, setReportReason] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, replyTo);
      setNewComment("");
      setReplyTo(undefined);
    }
  };

  const handleReport = (commentId: string) => {
    if (reportReason.trim()) {
      onReport(commentId, reportReason);
      setReportReason("");
    }
  };

  const renderComments = (comments: Comment[], isReply = false) => (
    <ul className={`space-y-4 ${isReply ? "ml-6" : ""}`}>
      {comments.map((comment) => (
        <li key={comment.id} className="border-l pl-4 border-[var(--text-secondary)] break-words">
          <div>
            <p className="font-medium text-[var(--text-primary)]">{comment.author}</p>
            <p className="text-sm text-[var(--text-secondary)] mb-2">{comment.content}</p>
            <p className="text-xs text-[var(--text-secondary)]">{comment.created_at}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onVote(comment.id, 1)}
                className="text-xs text-[var(--text-primary)] hover:text-[var(--button-hover)]"
              >
                Upvote
              </button>
              <span className="text-xs text-[var(--text-secondary)]">{comment.rating}</span>
              <button
                onClick={() => onVote(comment.id, -1)}
                className="text-xs text-[var(--text-primary)] hover:text-[var(--button-hover)]"
              >
                Downvote
              </button>
              <button
                className="text-xs text-[var(--text-primary)] hover:text-[var(--button-hover)] ml-2"
                onClick={() => setReplyTo(comment.id)}
              >
                Reply
              </button>
              <button
                className="text-xs text-red-600 hover:text-red-800 ml-2"
                onClick={() => handleReport(comment.id)}
              >
                Report
              </button>
            </div>
            {comment.replies && renderComments(comment.replies, true)}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4 bg-[var(--card-background)] rounded shadow-md">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Comments</h3>
      {renderComments(comments)}
      <div className="mt-4">
        {replyTo && (
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Replying to comment ID: {replyTo}
          </p>
        )}
        <textarea
          className="w-full p-2 bg-[var(--input-background)] border rounded focus:outline-none focus:border-[var(--input-focus)] font-mono text-sm"
          rows={3}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <button
            className="px-4 py-2 text-white bg-[var(--text-primary)] rounded hover:bg-[var(--button-hover)]"
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
