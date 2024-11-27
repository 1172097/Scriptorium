// This file was created with the assistance of GPT-4
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Link from "next/link";

interface Tag {
  id: number;
  name: string;
}

interface Comment {
    id: number;
    content: string;
    rating: number;
    created_at: string;
    replies: Comment[]; // Nested replies
    author: {
      username: string;
      profile_picture?: string;
    };
  }

interface Template {
  title: string;
  id: number;
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
  comments: Comment[];
}

const PostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteInProgress, setVoteInProgress] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const data = await api.get(`/posts/${id}`);
        setPost(data.post);
        setUserRating(data.userRating?.value || null); // Extract user rating from API
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div key={comment.id} className="pl-4 border-l border-gray-300 dark:border-gray-700 mb-4">
        <div className="flex items-center mb-2">
          <img
            src={comment.author.profile_picture || "/api/placeholder/32/32"}
            alt={comment.author.username}
            className="h-8 w-8 rounded-full mr-2"
          />
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            {comment.author.username}
          </span>
          {/* Date */}
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-sm mb-2 text-[var(--text-secondary)]">{comment.content}</p>

        {/* Upvote/Downvote Section */}
        <div className="flex items-center space-x-1">
          <button
            className="text-[var(--text-primary)] text-lg transition-colors bg-transparent border-none p-0 cursor-pointer"
            onClick={() => handleVote(1)}
          >
            ⬆
          </button>
          <span className="text-sm font-bold text-[var(--text-primary)]">{post?.rating}</span>
          <button
            className="text-[var(--text-primary)] text-lg transition-colors bg-transparent border-none p-0 cursor-pointer"
            onClick={() => handleVote(-1)}
          >
            ⬇
          </button>
        </div>

        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies)}
      </div>
    ));
  };

  const handleVote = async (ratingValue: number) => {
    if (!post) return;

    const alreadyVoted = userRating === ratingValue;

    // Check if user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setVoteInProgress(true);

      // API call to rate the post
      await api.post(`/posts/${post.id}/comments/rate`, {
        ratingValue: alreadyVoted ? 0 : ratingValue, // Send 0 to remove vote
      });

      // Update local state to reflect the new vote
      const updatedRating =
        post.rating + (alreadyVoted ? -ratingValue : ratingValue - (userRating || 0));

      setPost({ ...post, rating: updatedRating });
      setUserRating(alreadyVoted ? null : ratingValue); // Update user rating
    } catch (err) {
      console.error("Failed to vote:", err);
      alert("An error occurred while voting. Please try again.");
    } finally {
      setVoteInProgress(false);
    }
  };

  const handleClosePopup = () => setShowLoginPopup(false);

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
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text- transition-colors"
          >
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
            <ul className="list-disc list-inside">
              {post.templates.map((template) => (
                <li key={template.id}>
                  <Link href={`/t/${template.id}`}>{template.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upvote/Downvote Section */}
        <div className="flex items-center space-x-2">
          <button
            className="text-[var(--text-primary)] text-xl transition-colors bg-transparent border-none p-0 cursor-pointer"
            onClick={() => handleVote(1)}
          >
            ⬆
          </button>
          <span className="text-md font-bold text-[var(--text-primary)]">{post.rating}</span>
          <button
            className="text-[var(--text-primary)] text-xl transition-colors bg-transparent border-none p-0 cursor-pointer"
            onClick={() => handleVote(-1)}
          >
            ⬇
          </button>
        </div>

        {/* Comments Section */}
        {post.comments && post.comments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Comments:</h2>
            {renderComments(post.comments)}
          </div>
        )}

      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Login Required
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              You need to log in to vote. Would you like to log in now?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
