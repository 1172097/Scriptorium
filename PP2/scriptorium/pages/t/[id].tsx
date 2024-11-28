import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/NavBar";

interface Tag {
  id: number;
  name: string;
}

interface Author {
  username: string;
  user_id: number;
}

interface Template {
  id: number;
  title: string;
  description: string;
  content: string;
  language: string;
  tags: Tag[];
  author: Author;
}

const TemplateDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<Template | null>(null);
  const [theme, setTheme] = useState('light');
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [editableCode, setEditableCode] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/templates/view?id=${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch template');
        }
        
        setTemplate(data);
        setEditableCode(data.content); // Initialize editable code with template content
      } catch (error) {
        console.error('Error fetching template:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  useEffect(() => {
    // Get user ID from session storage when component mounts
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.user_id);
    }
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setEditableCode(value || '');
  };

  const handleExecuteCode = async () => {
    console.log(userId);
    console.log(template?.id);
    if (!template) return;
    
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editableCode, // Use editable code instead of template.content
          language: template.language,
          input: userInput
        }),
      });
      const data = await response.json();
      setOutput(data.output || data.error || 'Error executing code');
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FEF7FF] dark:bg-[#3F384C]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A5294] dark:border-[#D4BBFF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FEF7FF] dark:bg-[#3F384C]">
        <div className="text-[#6A5294] dark:text-[#D4BBFF]">{error}</div>
      </div>
    );
  }

  if (!template) {
    return <div className="flex justify-center items-center h-screen">Template not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FEF7FF] dark:bg-[#3F384C] transition-colors duration-300">
      {/* <Navbar /> */}
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          {/* Left Panel */}
          <aside className="w-1/2 p-6 flex flex-col space-y-6 bg-white dark:bg-[#2D2640] shadow-lg transition-colors duration-300">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#6A5294] dark:text-[#D4BBFF] mr-2">
                  {template.title}
                </h1>
                <p className="text-sm text-[#6A5294] dark:text-[#D4BBFF] opacity-70">
                  by {template.author.username}
                </p>
              </div>
              {userId && (
                userId === template.author.user_id ? (
                  <button
                    onClick={() => router.push(`/t/edit_template?id=${template.id}`)}
                    className="px-4 py-2 rounded-md bg-[#6A5294] dark:bg-[#D4BBFF] 
                      text-white dark:text-[#3F384C] font-medium text-sm"
                  >
                    Edit Template
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/t/fork_template?id=${template.id}`)}
                    className="px-4 py-2 rounded-md bg-[#6A5294] dark:bg-[#D4BBFF] 
                      text-white dark:text-[#3F384C] font-medium text-sm"
                  >
                    Fork Template
                  </button>
                )
              )}
            </header>
            
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {template.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="inline-block px-4 py-1 rounded-full 
                      bg-[#6A5294] dark:bg-[#D4BBFF] 
                      text-white dark:text-[#3F384C] 
                      font-bold text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <p className="text-[#6A5294] dark:text-[#D4BBFF]">
                {template.description}
              </p>
            </section>
          </aside>

          {/* Right Panel */}
          <section className="w-1/2 p-6 bg-white dark:bg-[#2D2640] shadow-lg transition-colors duration-300">
            <div className="flex justify-end gap-2 mb-4">
              <div className="px-3 py-0.5 text-sm rounded-md border border-[#6A529433] dark:border-[#D4BBFF33] 
                bg-[#FEF7FF] dark:bg-[#3F384C] text-[#6A5294] dark:text-[#D4BBFF]">
                {template.language}
              </div>
              <button
                onClick={handleExecuteCode}
                className="px-3 py-0.5 text-sm rounded-md bg-[#6A5294] dark:bg-[#D4BBFF] 
                  text-white dark:text-[#3F384C] font-medium"
              >
                Run
              </button>
            </div>

            <Editor
              height="500px"
              defaultLanguage={template.language}
              value={editableCode}
              onChange={handleEditorChange}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#6A5294] dark:text-[#D4BBFF] mb-2">
                Program Input (stdin)
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your input here (one input per line)"
                className="w-full px-3 py-2 rounded-lg
                  bg-[#FEF7FF] dark:bg-[#3F384C] 
                  text-[#6A5294] dark:text-[#D4BBFF] 
                  border border-[#6A529433] dark:border-[#D4BBFF33]"
                rows={3}
              />
            </div>
          </section>
        </div>
        
        {/* Output Panel */}
        {output && (
          <div className="h-32 p-4 bg-white dark:bg-[#2D2640] border-t border-[#6A529433] dark:border-[#D4BBFF33]">
            <div className="h-full overflow-auto rounded-lg bg-[#FEF7FF] dark:bg-[#3F384C] 
              text-[#6A5294] dark:text-[#D4BBFF] border border-[#6A529433] dark:border-[#D4BBFF33] p-4">
              <pre className="text-sm">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateDetail;
