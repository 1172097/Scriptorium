// # made by chatGPT


import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/NavBar";
import EditableDescription from "@/components/TemplateEditor";

interface Tag {
  id: number;
  name: string;
}

const EditTemplatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState(``);
  const [theme, setTheme] = useState('light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   document.documentElement.setAttribute('data-theme', newTheme);
  // };

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/templates/view?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch template');
        }
        
        const data = await response.json();
        
        // Set all the template data
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCode(data.content || '');
        setLanguage(data.language || 'python');
        // Safely handle tags array
        const templateTags = data.tags?.map((tag: Tag) => tag.name) || [];
        setTags(templateTags);
      } catch (error) {
        console.error('Error fetching template:', error);
        // Optionally show error to user
        alert('Failed to load template');
      }
    };

    fetchTemplate();
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
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

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const EditableTitle = () => (
    <div className="flex items-center">
      {isEditingTitle ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsEditingTitle(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
          className="text-2xl font-bold w-full 
            bg-[var(--input-background)]
            text-[var(--text-primary)]
            border border-[var(--border)]
            rounded-lg px-2 py-1"
          autoFocus
        />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-[#6A5294] dark:text-[#D4BBFF] mr-2">
            {title}
          </h1>
          <button 
            onClick={() => setIsEditingTitle(true)} 
            className="text-[#6A5294] dark:text-[#D4BBFF] 
            opacity-50 hover:opacity-100 
            transition-opacity duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );

  const handleExecuteCode = async () => {
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input: userInput
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(data.error || 'Error executing code');
      }
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  const updateTemplate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          content: code,
          language,
          tags: tags.filter(tag => tag.trim() !== '')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      const data = await response.json();
      alert('Template updated successfully!');
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    }
  };

  return ( 
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* <Navbar /> */}
      <div className="flex flex-col h-screen">
        <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
          <aside className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var(--card-background)] shadow-lg transition-colors duration-300
            lg:overflow-y-auto">
            <header>
              <EditableTitle />
            </header>
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-block px-4 py-1 rounded-full 
                      bg-[var(--highlight)]
                      text-[var(--highlight-text)]
                      font-bold text-sm"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)} 
                      className="ml-2 text-white dark:text-[#3F384C] 
                      opacity-50 hover:opacity-100 
                      transition-opacity duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                ))}
                <div className="flex items-center">
                  <input 
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag"
                    className="w-24 px-2 py-1 mr-2
                      bg-[var(--input-background)]
                      text-[var(--text-primary)]
                      border border-[var(--border)]
                      rounded-lg text-sm"
                  />
                  <button 
                    onClick={addTag} 
                    className="text-[#6A5294] dark:text-[#D4BBFF] 
                    opacity-50 hover:opacity-100 
                    transition-opacity duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <EditableDescription description={description} setDescription={setDescription} />
            </section>
          </aside>
          <section className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var(--card-background)] shadow-lg transition-colors duration-300
            flex flex-col lg:min-h-0">
            <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-auto px-1.5 py-0.5 text-sm rounded-md border border-[var(--border)]
                  bg-[var(--input-background)] text-[var(--text-primary)]"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="golang">Golang</option>
              </select>
              <div className="flex gap-2">
                {language.toLowerCase() === 'python' && (
                  <button
                    onClick={handleAnalyzeCode} 
                    className="flex-1 sm:flex-none px-3 py-0.5 text-sm rounded-md 
                      bg-[var(--highlight)] text-[var(--highlight-text)] font-medium"
                  >
                    Analyze
                  </button>
                )}
                <button
                  onClick={updateTemplate}
                  className="px-3 py-0.5 text-sm rounded-md bg-[var(--highlight)]
                    text-[var(--highlight-text)] font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleExecuteCode}
                  className="px-3 py-0.5 text-sm rounded-md bg-[var(--highlight)]
                    text-[var(--highlight-text)] font-medium"
                >
                  Run
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 mb-2">
              <Editor
                height="calc(100vh - 300px)"
                defaultLanguage="python"
                value={code}
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

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

export default EditTemplatePage;
