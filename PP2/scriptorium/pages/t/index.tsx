import React, { useState, useEffect } from 'react';
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
    },     {
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
    },     {
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
    },     {
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
    },     {
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
    },     {
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
    <>
      <NavBar />
      <div className="min-h-screen pt-20 p-6 bg-[#FEF7FF] dark:bg-[#3F384C]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#6A5294] dark:text-[#D4BBFF]">
              Code Templates
            </h1>
            <Link href="/create_template" 
                  className="text-[#6A5294] dark:text-[#D4BBFF] hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A5294] dark:border-[#D4BBFF]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CodeTemplateList;