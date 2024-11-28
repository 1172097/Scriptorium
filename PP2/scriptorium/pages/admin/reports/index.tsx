import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import ReportCard from "@/components/ReportCard";
import CommentCard from "@/components/CommentCard";

type Post = {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
  };
  numReports: number;
};

type Comment = {
  id: number;
  content: string;
  author: {
    username: string;
  };
  numReports: number;
};

const AdminReports: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [postPage, setPostPage] = useState(1);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [hasMoreComments, setHasMoreComments] = useState(true);
  
    const fetchReports = async (page: number, type: "posts" | "comments") => {
      setLoading(true);
      setError(null);
  
      try {
        if (type === "posts") {
          const response = await api.get(`/admin/posts?page=${page}`);
          setPosts((prev) => [...prev, ...response.posts]);
          setHasMorePosts(response.posts.length > 0);
          setPostPage(page); // Update the page number
        } else {
          const response = await api.get(`/admin/comments?page=${page}`);
          setComments((prev) => [...prev, ...response.comments]);
          setHasMoreComments(response.comments.length > 0);
          setCommentPage(page); // Update the page number
        }
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err);
        setError(`Failed to fetch ${type}`);
      } finally {
        setLoading(false);
      }
    };
  
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50 &&
        !loading
      ) {
        if (hasMorePosts) fetchReports(postPage + 1, "posts");
        if (hasMoreComments) fetchReports(commentPage + 1, "comments");
      }
    };
  
    const handleHidePost = async (id: number) => {
      try {
        await api.patch(`/admin/posts/${id}`, "");
        setPosts((prev) => prev.filter((post) => post.id !== id));
        setPostPage(1); // Reset page to load new data
        setPosts([]); // Clear posts
        fetchReports(1, "posts"); // Fetch new data
      } catch (err) {
        console.error("Failed to hide post:", err);
        alert("Failed to hide post. Please try again.");
      }
    };
  
    const handleHideComment = async (id: number) => {
      try {
        await api.patch(`/admin/comments/${id}`, "");
        setComments((prev) => prev.filter((comment) => comment.id !== id));
        setCommentPage(1); // Reset page to load new data
        setComments([]); // Clear comments
        fetchReports(1, "comments"); // Fetch new data
      } catch (err) {
        console.error("Failed to hide comment:", err);
        alert("Failed to hide comment. Please try again.");
      }
    };
  
    useEffect(() => {
      fetchReports(1, "posts");
      fetchReports(1, "comments");
    }, []);
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, postPage, commentPage, hasMorePosts, hasMoreComments]);
  
    if (loading && posts.length === 0 && comments.length === 0)
      return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reported Posts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <ReportCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  description={post.content.substring(0, 100) + "..."}
                  author={post.author.username}
                  numReports={post.numReports}
                  onHide={handleHidePost}
                />
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </div>
  
          {/* Reported Comments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  content={comment.content}
                  author={comment.author.username}
                  numReports={comment.numReports}
                  onHide={handleHideComment}
                />
              ))
            ) : (
              <p>No comments found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminReports;