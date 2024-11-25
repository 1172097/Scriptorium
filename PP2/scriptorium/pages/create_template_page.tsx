import React, { useState } from 'react';

interface TemplateData {
  title: string;
  description: string;
  content: string;
  language: string;
  tags: string[];
}

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'PHP',
  'HTML',
  'CSS',
  'SQL',
  'Other'
];

export default function CreateTemplate() {
  const [templateData, setTemplateData] = useState<TemplateData>({
    title: '',
    description: '',
    content: '',
    language: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setTemplateData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!templateData.tags.includes(tagInput.trim())) {
        setTemplateData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...templateData,
          isForked: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      // Handle successful creation
      console.log('Template created successfully');
      // You might want to redirect or show a success message here
    } catch (error) {
      console.error('Error creating template:', error);
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF7FF] dark:bg-[#3F384C] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#2D2640] rounded-2xl p-6 md:p-10 shadow-lg">
          <h1 className="text-[#6A5294] dark:text-[#D4BBFF] text-3xl font-bold text-center mb-8">
            Create Code Template
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label 
                htmlFor="title" 
                className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={templateData.title}
                onChange={handleChange}
                className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                         dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                         focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                         text-[#6A5294] dark:text-[#D4BBFF]"
                placeholder="Enter template title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={templateData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                         dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                         focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                         text-[#6A5294] dark:text-[#D4BBFF]"
                placeholder="Describe your code template"
                required
              />
            </div>

            {/* Language Selection */}
            <div>
              <label 
                htmlFor="language" 
                className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
              >
                Language
              </label>
              <select
                id="language"
                name="language"
                value={templateData.language}
                onChange={handleChange}
                className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                         dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                         focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                         text-[#6A5294] dark:text-[#D4BBFF]"
                required
              >
                <option value="">Select a language</option>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Code Content */}
            <div>
              <label 
                htmlFor="content" 
                className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
              >
                Code
              </label>
              <textarea
                id="content"
                name="content"
                value={templateData.content}
                onChange={handleChange}
                rows={10}
                className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                         dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                         focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                         text-[#6A5294] dark:text-[#D4BBFF] font-mono"
                placeholder="Paste your code here"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label 
                htmlFor="tags" 
                className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
              >
                Tags
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                           dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                           focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                           text-[#6A5294] dark:text-[#D4BBFF]"
                  placeholder="Add tags (press Enter to add)"
                />
                <div className="flex flex-wrap gap-2">
                  {templateData.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full 
                               bg-[#EBDCFF] dark:bg-[#513A7A] 
                               text-[#6A5294] dark:text-[#D4BBFF]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-sm hover:text-[#563E80] dark:hover:text-[#EBDCFF]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6A5294] dark:bg-[#D4BBFF] text-white dark:text-[#3F384C] 
                       py-3 rounded-lg font-semibold hover:bg-[#563E80] 
                       dark:hover:bg-[#EBDCFF] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}