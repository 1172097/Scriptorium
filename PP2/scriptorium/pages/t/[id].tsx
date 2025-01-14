// # made by chatGPT

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
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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


  const handleAnalyzeCode = async () => {
    try {
      // Get editor instance and selected text
      const selection = window.getSelection()?.toString();
      
      if (!selection) {
        alert('Please highlight some code to analyze');
        return;
      }
  
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: selection
        })
      });
      console.log(response)
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Analysis failed: ${errorText}`);
        return;
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        // Display the analysis results
        const { confidence, prediction } = data;
        alert(`Analysis results:\nPrediction: ${prediction}\nConfidence: ${(confidence * 100).toFixed(2)}%`);
        console.log('Analysis results:', data);
      } else {
        const errorText = await response.text();
        // console.error('Error analyzing code:', errorText);
        alert('Failed to analyze code');
      }
  
    } catch (error) {
      // console.error('Error analyzing code:', error);
      alert('Failed to analyze code');
    }
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
    <div className="min-h-screen bg-[var(--background-primary)] transition-colors duration-300">
      {/* <Navbar /> */}
      <div className="flex flex-col h-screen">
        <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
          {/* Left Panel */}
          <aside className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var(--card-background)] shadow-lg transition-colors duration-300 
            lg:overflow-y-auto">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mr-2">
                  {template.title}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] opacity-70">
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
                    className="inline-block px-4 py-1 rounded-full bg-[var(--accent-color)] text-[var(--accent-text)] font-bold text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <p className="text-[var(--text-primary)]">
                {template.description}
              </p>
            </section>
          </aside>

          {/* Right Panel */}
          <section className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var(--card-background)] shadow-lg transition-colors duration-300
            flex flex-col lg:min-h-0">
            <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
              <div className="px-3 py-0.5 text-sm rounded-md border border-[var(--border)] 
              bg-[var(--input-background)] text-[var(--text-primary)]">
              {template.language}
              </div>
              <div className="flex gap-2">
              {template.language === 'Python' && (
                <button
                onClick={handleAnalyzeCode} 
                className="px-3 py-0.5 text-sm rounded-md 
                  bg-[var(--highlight)] text-[var(--highlight-text)] font-medium"
                >
                Analyze
                </button>
              )}
              <button
                onClick={handleExecuteCode}
                className="px-3 py-0.5 text-sm rounded-md bg-[var(--highlight)] 
                text-[var(--highlight-text)] font-medium"
              >
                Run
              </button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0 mb-2">
              <Editor
                height="calc(100vh - 300px)"
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
            </div>

            {/* Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Program Input (stdin)
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your input here (one input per line)"
                className="w-full px-3 py-2 rounded-lg
                  bg-[var(--input-background)]
                  text-[var(--text-primary)]
                  border border-[var(--border)]"
                rows={3}
              />
            </div>
          </section>
        </div>
        
        {/* Output Panel */}
        {output && (
          <div className="h-24 lg:h-32 
            bg-[var(--card-background)] border-t border-[var(--border)]">
            <div className="h-full p-3 lg:p-4">
              <div className="h-full overflow-auto rounded-lg 
                bg-[var(--input-background)]
                text-[var(--text-primary)] 
                border border-[var(--border)] p-4">
                <pre className="text-sm">{output}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateDetail;
