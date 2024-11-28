// made with assistance from chatGPT
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import LoginPopup from "@/components/loginPopup";

interface Tag {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  replies: { id: number }[]; // Array of reply objects with only IDs
  author: {
    username: string;
    profile_picture?: string;
  };
}

interface Template {
  id: number;
  title: string;
}

interface Author {
  username: string;
  profile_picture?: string;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags?: Tag[];
  templates?: Template[];
  author: Author;
  rating: number;
  comments: { id: number }[]; // Array of comment objects with only IDs
}

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Record<number, Comment>>({});
  const [userRatings, setUserRatings] = useState<Record<number, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [reportPopup, setReportPopup] = useState<{ entityId: number; isPost: boolean } | null>(
    null
  );
  const [reportReason, setReportReason] = useState<string>("");

  const [replyPopup, setReplyPopup] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  const [sortOrder, setSortOrder] = useState<"decs" | "asc">("decs");

  const fetchComment = async (commentId: number) => {
    try {
      const response = await api.get(`/posts/${id}/comments/${commentId}`);
      const { comment, userRating } = response;

      setUserRatings((prev) => ({
        ...prev,
        [commentId]: userRating?.value || null,
      }));

      setComments((prev) => ({
        ...prev,
        [comment.id]: comment,
      }));

      // Recursively fetch replies
      if (comment.replies.length > 0) {
        const replyIds = comment.replies.map((reply: { id: number }) => reply.id);
        await fetchComments(replyIds);
      }
    } catch (err) {
      console.error(`Failed to fetch comment ${commentId}:`, err);
    }
  };

  const fetchComments = async (commentIds: number[]) => {
    await Promise.all(commentIds.map(fetchComment));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "decs" ? "asc" : "decs"));
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const data = await api.get(`/posts/${id}?sortBy=${sortOrder}`);
        setPost(data.post);

        // Initialize user ratings for the post
        setUserRatings((prev) => ({
          ...prev,
          [-1]: data.userRating?.value || null, // Map post rating to key -1
        }));

        // Extract comment IDs from the response
        const commentIds = data.post.comments.map((comment: { id: number }) => comment.id);

        // Fetch all comments and their replies
        await fetchComments(commentIds);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, sortOrder]);

  const handleVote = async (entityId: number, ratingValue: number) => {
    const isPost = entityId === -1;
    const alreadyVotedValue = userRatings[entityId];

    // If the user presses the same vote again, undo it
    const newRatingValue = alreadyVotedValue === ratingValue ? 0 : ratingValue;

    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const body = {
        ratingValue: newRatingValue,
        ...(isPost ? {} : { commentId: entityId }), // Add commentId only for comments
      };

      await api.post(`/posts/${id}/comments/rate`, body);

      // Calculate the adjustment for the rating
      const adjustment = newRatingValue - (alreadyVotedValue || 0);

      // Update the user rating and local state
      setUserRatings((prev) => ({
        ...prev,
        [entityId]: newRatingValue === 0 ? null : newRatingValue,
      }));

      if (isPost) {
        setPost((prev) =>
          prev ? { ...prev, rating: prev.rating + adjustment } : null
        );
      } else {
        setComments((prev) => ({
          ...prev,
          [entityId]: {
            ...prev[entityId],
            rating: prev[entityId].rating + adjustment,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const handleReport = async () => {
    if (!reportPopup || !reportReason.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }


    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) {
      setShowLoginPopup(true);
      setReportPopup(null);
      setReportReason("");
      return;
    }

    const { entityId, isPost } = reportPopup;

    try {
      const body = {
        reason: reportReason,
        ...(isPost ? {} : { commentId: entityId }),
      };

      await api.post(`/posts/${id}/comments/report`, body);

      setReportPopup(null);
      setReportReason("");
      router.reload();
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  const handleReply = async () => {
    if (!replyPopup || !replyContent.trim()) {
      alert("Reply content cannot be empty.");
      return;
    }

    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) {
      setShowLoginPopup(true);
      setReplyPopup(null);
      setReplyContent("");
      return;
    }

    try {
      const body = {
        content: replyContent,
        parentId: replyPopup === -1 ? null : replyPopup,
      };

      const response = await api.post(`/posts/${id}/comments/create`, body);

      // Add the new reply to the comments state
      setComments((prev) => ({
        ...prev,
        [response.id]: response,
      }));

      setReplyPopup(null);
      setReplyContent("");
      router.reload();
    } catch (err) {
      console.error("Failed to submit reply:", err);
      alert("Failed to submit reply. Please try again.");
    }
  };

  const renderComments = (commentIds: number[]) => {
    return commentIds.map((commentId) => {
      const comment = comments[commentId];
      if (!comment) return null;

      return (
        <div key={comment.id} className="pl-4 border-l border-gray-300 dark:border-gray-700 mb-4">
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
          <p className="text-sm mb-2 text-[var(--text-secondary)]">{comment.content}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                className="text-xl bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
                onClick={() => handleVote(comment.id, 1)}
              >
                <span
                  className={`hover:text-green-600 ${
                    userRatings[comment.id] === 1 ? "text-green-500" : "text-[var(--text-primary)]"
                  }`}
                >
                  ⬆
                </span>
              </button>
              <span className="text-md font-bold text-[var(--text-primary)]">{Math.max(comment.rating, 0)}</span>
              <button
                className="text-xl bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
                onClick={() => handleVote(comment.id, -1)}
              >
                <span
                  className={`hover:text-red-600 ${
                    userRatings[comment.id] === -1 ? "text-red-500" : "text-[var(--text-primary)]"
                  }`}
                >
                  ⬇
                </span>
              </button>

            </div>


            {/* Reply Button */}
            <button
                className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
                onClick={() => setReplyPopup(comment.id)}
              >
                <span className="hover:text-green-600 text-[var(--text-primary)]" >
                  Reply
                </span>
            </button>

            {/* Report Button */}
            <button
                className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
                onClick={() => setReportPopup({ entityId: comment.id, isPost: false })}
              >
                <span className="hover:text-red-600 text-[var(--text-primary)]">
                  Report
                </span>
            </button>
          </div>

          {comment.replies.length > 0 && renderComments(comment.replies.map((reply) => reply.id))}
        </div>
      );
    });
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center p-6">Post not found.</div>;
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] p-6 relative">
      <div className="max-w-3xl mx-auto bg-[var(--card-background)] rounded-2xl shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <button onClick={() => router.back()} className="text- transition-colors">
            ← Back
          </button>
        </div>
  
        <div className="text-sm text-[var(--text-secondary)] mb-4">
          <span>by {post.author.username}</span>
          <span className="float-right">{formattedDate}</span>
        </div>
  
        <p className="mb-6">{post.content}</p>
  
        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-sm rounded-lg bg-[var(--highlight)] opacity-80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
  
        {post.templates && post.templates.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Templates:</h2>
            <div className="flex flex-wrap gap-2">
              {post.templates.map((template) => (
                <a
                  key={template.id}
                  href={`/t/${template.id}`}
                  className="px-3 py-1 text-sm rounded-lg bg-[var(--highlight)] opacity-80"
                >
                  {template.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center space-x-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <button
              className="text-xl bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
              onClick={() => handleVote(-1, 1)}
            >
              <span
                className={`hover:text-green-600 ${
                  userRatings[-1] === 1 ? "text-green-500" : "text-[var(--text-primary)]"
                }`}
              >
                ⬆
              </span>
            </button>
            <span className="text-md font-bold text-[var(--text-primary)]">{Math.max(post.rating, 0)}</span>
            <button
              className="text-xl bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
              onClick={() => handleVote(-1, -1)}
            >
              <span
                className={`hover:text-red-600 ${
                  userRatings[-1] === -1 ? "text-red-500" : "text-[var(--text-primary)]"
                }`}
              >
                ⬇
              </span>
            </button>
          </div>
          {/* Reply Button */}
          <button
                className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
                onClick={() => setReplyPopup(-1)}
              >
                <span className="hover:text-green-600 text-[var(--text-primary)]" >
                  Comment
                </span>
          </button>

          {/* Report Button */}
          <button
              className="text-sm bg-transparent border-none p-0 cursor-pointer hover:bg-transparent"
              onClick={() => setReportPopup({ entityId: -1, isPost: true })}
            >
              <span className="hover:text-red-600 text-[var(--text-primary)]">
                Report
              </span>
          </button>
          
        </div>

        <span className="text-sm text-[var(--text-primary)]"> Sort By:</span>
        <button
            className="text-sm bg-transparent border-none p-1 pl-2 pr-2 rounded-full"
            onClick={toggleSortOrder}
          >
            <span className="text-[var(--text-primary)]">
            {sortOrder === "asc" ? "Worst" : "Best"}
            </span>
        </button>
  
        {post.comments && post.comments.length > 0 && (
          <div className="mb-6">
            {renderComments(post.comments.map((comment) => comment.id))}
          </div>
        )}
      </div>

      {/* Login Popup */}
      <LoginPopup
        isVisible={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={() => router.push("/login")}
      />

      {/* Report Popup */}
      {reportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Report {reportPopup.isPost ? "Post" : "Comment"}</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              placeholder="Enter reason for reporting..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setReportPopup(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Popup */}
      {replyPopup !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Reply</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              placeholder="Enter your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setReplyPopup(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleReply}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
