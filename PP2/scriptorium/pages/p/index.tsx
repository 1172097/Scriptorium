import React, { useState, useEffect, useCallback, useRef } from "react";
import BlogCard from "@/components/BlogCard";
import { api } from "@/utils/api";
import { isAuthenticated } from "@/utils/authFront"; // Import a utility to check authentication
import LoginPopup from "@/components/loginPopup";
import { useRouter } from "next/router";

const BlogPostsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [templateQuery, setTemplateQuery] = useState("");
  const [tags, setTags] = useState<number[]>([]);
  const [templates, setTemplates] = useState<number[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const [selectedTagDetails, setSelectedTagDetails] = useState<any[]>([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<any[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"decs" | "asc">("decs");
  const [fetchOwned, setFetchOwned] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
      if (
        templateDropdownRef.current &&
        !templateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTemplateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await api.get(`/tags?query=${tagQuery}&pageSize=4`);
        setAllTags(data.tags || []);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    if (isTagDropdownOpen) fetchTags();
  }, [tagQuery, isTagDropdownOpen]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await api.get(`/templates?query=${templateQuery}&limit=4`);
        setAllTemplates(data.templates || []);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };

    if (isTemplateDropdownOpen) fetchTemplates();
  }, [templateQuery, isTemplateDropdownOpen]);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const data = await api.get(
          `/posts?query=${query}&tags=${tags.join(",")}&templates=${templates.join(",")}&page=${
            reset ? 1 : page
          }&pageSize=9&sortBy=${sortOrder}&fetchOwned=${fetchOwned}`
        );

        if (reset) {
          setPosts(data.posts);
        } else {
          setPosts((prev) => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    },
    [query, tags, templates, page, sortOrder, fetchOwned]
  );

  useEffect(() => {
    fetchPosts(true);
  }, [query, tags, templates, sortOrder, fetchOwned]);

  useEffect(() => {
    if (page > 1) fetchPosts();
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (!loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const clearFilters = () => {
    setQuery("");
    setTagQuery("");
    setTemplateQuery("");
    setTags([]);
    setTemplates([]);
    setSelectedTagDetails([]);
    setSelectedTemplateDetails([]);
    setPage(1);
    fetchPosts(true);
  };

  const addTag = (tag: any) => {
    if (!tags.includes(tag.id)) {
      setTags((prev) => [...prev, tag.id]);
      setSelectedTagDetails((prev) => [...prev, tag]);
    }
    setTagQuery("");
    setIsTagDropdownOpen(false);
  };

  const addTemplate = (template: any) => {
    if (!templates.includes(template.id)) {
      setTemplates((prev) => [...prev, template.id]);
      setSelectedTemplateDetails((prev) => [...prev, template]);
    }
    setTemplateQuery("");
    setIsTemplateDropdownOpen(false);
  };

  const removeTag = (tagId: number) => {
    setTags((prev) => prev.filter((id) => id !== tagId));
    setSelectedTagDetails((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const removeTemplate = (templateId: number) => {
    setTemplates((prev) => prev.filter((id) => id !== templateId));
    setSelectedTemplateDetails((prev) =>
      prev.filter((template) => template.id !== templateId)
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "decs" ? "asc" : "decs"));
  };

  const toggleFetchOwned = () => {
    setFetchOwned((prev) => !prev);
  };

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    router.push("/p/create");
  }

  return (

    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#6A5294] dark:text-[#D4BBFF]">
              Posts
            </h1>
            <span onClick={handleCreatePost}
                  className="text-[#6A5294] dark:text-[#D4BBFF] hover:opacity-80 transition-opacity hover:text-[var(--button-hover)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Content Search */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content or title..."
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-[var(--card-background)] text-[var(--text-primary)]"
          />

          {/* Tag Search */}
          <div className="relative" ref={tagDropdownRef}>
            <input
              type="text"
              value={tagQuery}
              onClick={() => setIsTagDropdownOpen(true)}
              onChange={(e) => setTagQuery(e.target.value)}
              placeholder="Search tags..."
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-[var(--card-background)] text-[var(--text-primary)]"
            />
            {isTagDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                {allTags.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => addTag(tag)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${
                      tags.includes(tag.id) ? "bg-blue-100 dark:bg-blue-900" : ""
                    }`}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedTagDetails.map((tag) => (
              <button
                key={tag.id}
                onClick={() => removeTag(tag.id)}
                className="ml-2 text-sm"
              >
                <span className="mr-2">{tag.name}</span>
                ×
              </button>
            ))}
          </div>

          {/* Template Search */}
          <div className="relative" ref={templateDropdownRef}>
            <input
              type="text"
              value={templateQuery}
              onClick={() => setIsTemplateDropdownOpen(true)}
              onChange={(e) => setTemplateQuery(e.target.value)}
              placeholder="Search templates..."
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-[var(--card-background)] text-[var(--text-primary)]"
            />
            {isTemplateDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                {allTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => addTemplate(template)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${
                      templates.includes(template.id)
                        ? "bg-green-100 dark:bg-green-900"
                        : ""
                    }`}
                  >
                    {template.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Templates */}
          <div className="flex flex-wrap gap-2">
            {selectedTemplateDetails.map((template) => (
              <button
                key={template.id}
                onClick={() => removeTemplate(template.id)}
                className="ml-2 text-sm"
              >
                <span className="mr-2">{template.title}</span>
                ×
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>

            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 rounded-lg"
            >
              Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>

            {/* FetchOwned Button */}
            {isLoggedIn && (
              <button
                onClick={toggleFetchOwned}
                className="px-4 py-2 rounded-lg"
              >
                {fetchOwned ? "My Posts" : "All Posts"}
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && !loading && posts.length > 0 && (
          <div className="text-center mt-6 text-gray-500">
            No more posts to load.
          </div>
        )}
      </div>

      {/* Login Popup */}
      <LoginPopup
        isVisible={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={() => router.push("/login")}
      />

    </div>
  );
};

export default BlogPostsPage;
