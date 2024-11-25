import React, { useState, useEffect } from 'react';

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
  const [templates, setTemplates] = useState<CodeTemplate[]>([
    {
      id: '1',
      title: 'React Component',
      description: 'A simple React component template.',
      language: 'JavaScript',
      stars: 10,
      forks: 2,
      tags: [{ id: '1', name: 'React' }, { id: '2', name: 'Component' }],
      author: { username: 'john_doe', profile_picture: '/api/placeholder/32/32' }
    },
    {
      id: '2',
      title: 'Python Script',
      description: 'A basic Python script template.',
      language: 'Python',
      stars: 15,
      forks: 5,
      tags: [{ id: '3', name: 'Python' }, { id: '4', name: 'Script' }],
      author: { username: 'jane_doe', profile_picture: '/api/placeholder/32/32' }
    },
        {
      id: '2',
      title: 'Python Script',
      description: 'A basic Python script template.',
      language: 'Python',
      stars: 15,
      forks: 5,
      tags: [{ id: '3', name: 'Python' }, { id: '4', name: 'Script' }],
      author: { username: 'jane_doe', profile_picture: '/api/placeholder/32/32' }
    },
        {
      id: '2',
      title: 'Python Script',
      description: 'A basic Python script template.',
      language: 'Python',
      stars: 15,
      forks: 5,
      tags: [{ id: '3', name: 'Python' }, { id: '4', name: 'Script' }],
      author: { username: 'jane_doe', profile_picture: '/api/placeholder/32/32' }
    },
        {
      id: '2',
      title: 'Python Script',
      description: 'A basic Python script template.',
      language: 'Python',
      stars: 15,
      forks: 5,
      tags: [{ id: '3', name: 'Python' }, { id: '4', name: 'Script' }],
      author: { username: 'jane_doe', profile_picture: '/api/placeholder/32/32' }
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#FEF7FF] dark:bg-[#3F384C]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#6A5294] dark:text-[#D4BBFF]">
          Code Templates
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A5294] dark:border-[#D4BBFF]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="bg-white dark:bg-[#2D2640] rounded-2xl p-6 shadow-lg 
                         hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-semibold text-[#6A5294] dark:text-[#D4BBFF]">
                      {template.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-[#6A5294B3] dark:text-[#D4BBFFB3]">
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span className="text-sm">{template.stars || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🔱</span>
                      <span className="text-sm">{template.forks || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-[#6A5294B3] dark:text-[#D4BBFFB3] mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-sm rounded-lg bg-[#EBDCFF] dark:bg-[#513A7A] 
                                 text-[#6A5294] dark:text-[#D4BBFF]">
                      {template.language}
                    </span>
                    {template.tags?.map((tag) => (
                      <span 
                        key={tag.id} 
                        className="px-3 py-1 text-sm rounded-lg bg-[#EBDCFF] dark:bg-[#513A7A] 
                                 text-[#6A5294] dark:text-[#D4BBFF] opacity-80"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <img
                      src={template.author.profile_picture || "/api/placeholder/32/32"}
                      alt={template.author.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm text-[#6A5294B3] dark:text-[#D4BBFFB3]">
                      by {template.author.username}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTemplateList;