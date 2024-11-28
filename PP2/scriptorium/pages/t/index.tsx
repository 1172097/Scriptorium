import React, { useState, useEffect, useRef } from 'react';
import TemplateCard from '@/components/TemplateCard';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

interface Tag {
  id: string;
  name: string;
}

interface Author {
  username: string;
  profile_picture?: string;
}

interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  language: string;
  stars?: number;
  forks?: number;
  tags?: Tag[];
  author: Author;
}

const CodeTemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [tags, setTags] = useState<number[]>([]);
  const [selectedTagDetails, setSelectedTagDetails] = useState<any[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [allTags, setAllTags] = useState<any[]>([]);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Add new pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTagName = (name: string) => name.trim().replace(/\s*,\s*/g, ',');

  const addTag = (tag: any) => {
    if (!tags.includes(tag.id)) {
      const formattedTag = {
        ...tag,
        name: formatTagName(tag.name)
      };
      setTags((prev) => [...prev, formattedTag.id]);
      setSelectedTagDetails((prev) => [...prev, formattedTag]);
    }
    setTagQuery("");
    setIsTagDropdownOpen(false);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const formattedQuery = formatTagName(tagQuery);
        const response = await fetch(`/api/tags?query=${formattedQuery}&pageSize=4`);
        const data = await response.json();
        interface TagResponse {
          id: number;
          name: string;
        }

        interface FetchTagsResponse {
          tags: TagResponse[];
        }

        setAllTags((data as FetchTagsResponse).tags?.map((tag: TagResponse) => ({
          ...tag,
          name: formatTagName(tag.name)
        })) || []);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };

    if (isTagDropdownOpen) fetchTags();
  }, [tagQuery, isTagDropdownOpen]);

  const removeTag = (tagId: number) => {
    setTags((prev) => prev.filter((id) => id !== tagId));
    setSelectedTagDetails((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const clearFilters = () => {
    setQuery("");
    setTagQuery("");
    setTags([]);
    setSelectedTagDetails([]);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const fetchTemplates = async (clearFilters = false) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'title',
        order: sortOrder,
      });

      if (query) searchParams.append('query', query);
      if (tags && tags.length > 0) searchParams.append('tags', tags.join(','));

      const response = await fetch(`/api/templates?${searchParams.toString()}`);
      const data = await response.json();
      
      if (data.templates) {
        setTemplates(data.templates);
        setHasMore(data.pagination.hasMore);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [query, tags, page, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Code Templates
          </h1>
          <Link href="/create_template" 
                className="text-[var(--text-primary)] hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Link>
        </div>
        
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content or title..."
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-[var(--card-background)] text-[var(--text-primary)]"
          />

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
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
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

          <div className="flex space-x-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-[#6A5294] text-white dark:bg-[#D4BBFF] dark:text-gray-900"
            >
              Clear Filters
            </button>

            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 rounded-lg bg-[#6A5294] text-white dark:bg-[#D4BBFF] dark:text-gray-900"
            >
              Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A5294] dark:border-[#D4BBFF]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Link 
                key={template.id} 
                href={`/t/${template.id}`} 
                className="transition-transform hover:scale-105"
              >
                <TemplateCard template={template} />
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-[#6A5294] text-white dark:bg-[#D4BBFF] dark:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            className="px-4 py-2 rounded-lg bg-[#6A5294] text-white dark:bg-[#D4BBFF] dark:text-gray-900 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeTemplateList;