// This file was created with the assistance of GPT-4
import React, { useState, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import NavBar from "@/components/NavBar";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: { id: string; name: string }[];
  author: { username: string; profile_picture?: string };
  created_at: string;
  rating: number;
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-20 p-6 bg-[var(--background-primary)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">
            Blog Posts
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
