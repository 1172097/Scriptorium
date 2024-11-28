import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<number[]>([]);
  const [templates, setTemplates] = useState<number[]>([]);
  const [newTags, setNewTags] = useState<string[]>([]); // New tags added by the user
  const [allTags, setAllTags] = useState<any[]>([]);
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const [selectedTagDetails, setSelectedTagDetails] = useState<any[]>([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<any[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [templateQuery, setTemplateQuery] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch post details on mount
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return;

      try {
        const data = await api.get(`/posts/${id}`);

        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
        if (!token) {
          router.push("/login");
          return;
        }
        const userData = await api.get("/auth/profile");
        if(userData.user.user_id !== data.post.authorId){
          router.push("/p");
        }

        setTitle(data.post.title);
        setContent(data.post.content);
        setTags(data.post.tags.map((tag: any) => tag.id));
        setTemplates(data.post.templates.map((template: any) => template.id));
        setSelectedTagDetails(data.post.tags);
        setSelectedTemplateDetails(data.post.templates);
      } catch (err) {
        console.error("Failed to fetch post details", err);
      }
    };

    fetchPostDetails();
  }, [id]);

  // Fetch tags and templates when dropdowns are open
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await api.get(`/tags?query=${tagQuery}&pageSize=5`);
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
        const data = await api.get(`/templates?query=${templateQuery}&limit=5`);
        setAllTemplates(data.templates || []);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };

    if (isTemplateDropdownOpen) fetchTemplates();
  }, [templateQuery, isTemplateDropdownOpen]);

  // Handle outside clicks for dropdowns
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

  const addTag = (tag: any) => {
    if (!tags.includes(tag.id)) {
      setTags((prev) => [...prev, tag.id]);
      setSelectedTagDetails((prev) => [...prev, tag]);
    }
    setTagQuery("");
    setIsTagDropdownOpen(false);
  };

  const removeTag = (tagId: number) => {
    setTags((prev) => prev.filter((id) => id !== tagId));
    setSelectedTagDetails((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const addTemplate = (template: any) => {
    if (!templates.includes(template.id)) {
      setTemplates((prev) => [...prev, template.id]);
      setSelectedTemplateDetails((prev) => [...prev, template]);
    }
    setTemplateQuery("");
    setIsTemplateDropdownOpen(false);
  };

  const removeTemplate = (templateId: number) => {
    setTemplates((prev) => prev.filter((id) => id !== templateId));
    setSelectedTemplateDetails((prev) => prev.filter((template) => template.id !== templateId));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      // Create new tags before saving the post
      const createdTags = await Promise.all(
        newTags.map(async (tagName) => {
          return await api.post(`/tags/create`, { name: tagName });
        })
      );

      const allTagIds = [
        ...tags,
        ...createdTags.map((tag: any) => tag.id), // Add new tag IDs
      ];

      const body = {
        title,
        content,
        tagIds: allTagIds,
        templateIds: templates,
      };

      await api.put(`/posts/${id}`, body);

      router.push(`/p/${id}`);
    } catch (err) {
      console.error("Failed to update post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/p/${id}`);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      router.push("/p");
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-4xl mx-auto bg-[var(--card-background)] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full px-4 py-2 mb-4 rounded-lg border"
        />

        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content"
          rows={8}
          className="w-full px-4 py-2 mb-4 rounded-lg border"
        />

        {/* Tags Selector */}
        <div className="relative mb-4" ref={tagDropdownRef}>
          <input
            type="text"
            value={tagQuery}
            onClick={() => setIsTagDropdownOpen(true)}
            onChange={(e) => setTagQuery(e.target.value)}
            placeholder="Search or add new tags..."
            className="w-full px-4 py-2 rounded-lg border"
          />
          {isTagDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
              {allTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => addTag(tag)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Tags Input */}
        <input
          type="text"
          placeholder="Add new tags (comma-separated)..."
          onBlur={(e) => {
            const newTagNames = e.target.value
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name);
            setNewTags((prev) => [...prev, ...newTagNames]);
            e.target.value = ""; // Clear input field
          }}
          className="w-full px-4 py-2 rounded-lg border mb-4"
        />

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTagDetails.map((tag) => (
            <button
              key={tag.id}
              onClick={() => removeTag(tag.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              {tag.name} ×
            </button>
          ))}
          {newTags.map((tagName, index) => (
            <button
              key={index}
              onClick={() =>
                setNewTags((prev) => prev.filter((name) => name !== tagName))
              }
              className="px-2 py-1 bg-gray-500 text-white rounded-lg text-sm"
            >
              {tagName} ×
            </button>
          ))}
        </div>

        {/* Templates Selector */}
        <div className="relative mb-4" ref={templateDropdownRef}>
          <input
            type="text"
            value={templateQuery}
            onClick={() => setIsTemplateDropdownOpen(true)}
            onChange={(e) => setTemplateQuery(e.target.value)}
            placeholder="Search templates..."
            className="px-4 py-2 rounded-lg border"
          />
          {isTemplateDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
              {allTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => addTemplate(template)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {template.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Templates */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTemplateDetails.map((template) => (
            <button
              key={template.id}
              onClick={() => removeTemplate(template.id)}
              className="px-2 py-1 bg-green-500 text-white rounded-lg text-sm"
            >
              {template.title} ×
            </button>
          ))}
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleSave}
            className={`w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            className="w-full py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditPostPage;
