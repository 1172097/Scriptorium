// # made by chatGPT

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/NavBar";
import EditableDescription from "@/components/TemplateEditor";

const CodeEditorPage = () => {
  const [code, setCode] = useState(``);

  const [theme, setTheme] = useState('light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['']);
  const [newTag, setNewTag] = useState('');

  // Edit state
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Simplified theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Inline editing components
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
            bg-[#FEF7FF] dark:bg-[#3F384C] 
            text-[#6A5294] dark:text-[#D4BBFF] 
            border border-[#6A529433] dark:border-[#D4BBFF33] 
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

  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState(''); // Add this new state

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
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input: userInput // Modified to include user input
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

  const createTemplate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          content: code,
          language,
          tags: tags.filter(tag => tag.trim() !== ''),
          isForked: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      const data = await response.json();
      // You can add success notification or redirect here
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template');
    }
  };

  // Update the layout sections with responsive classes
  return ( 
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* <Navbar /> */}
      <div className="flex flex-col h-screen">
        <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
          {/* Left Panel - Info Section */}
          <aside className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var(--card-background)] shadow-lg transition-colors duration-300
            lg:overflow-y-auto">
            <div className="flex flex-col space-y-4 lg:space-y-6">
              <header>
                <EditableTitle />
              </header>
              <section>
                {/* Tags section - same as before */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-block px-4 py-1 rounded-full 
                        bg-[var(--highlight)]
                        text-[#6A5294] dark:text-[#D4BBFF]
                        font-bold text-sm"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)} 
                        className="ml-2 text-[#6A5294] dark:text-[#D4BBFF]
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
                      className="text-[var(--text-primary)] 
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
            </div>
          </aside>

          {/* Right Panel - Editor Section */}
          <section className="w-full lg:w-1/2 p-4 lg:p-6 
            bg-[var--card-background] shadow-lg transition-colors duration-300
            flex flex-col lg:min-h-0">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-auto px-1.5 py-0.5 text-sm rounded-md 
                  border border-[var(--border)] 
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
                {language === 'python' && (
                  <button
                    onClick={handleAnalyzeCode} 
                    className="flex-1 sm:flex-none px-3 py-0.5 text-sm rounded-md 
                      bg-[var(--highlight)] text-[var(--highlight-text)] font-medium"
                  >
                    Analyze
                  </button>
                )}
                <button
                  onClick={createTemplate}
                  className="flex-1 sm:flex-none px-3 py-0.5 text-sm rounded-md 
                    bg-[var(--highlight)] text-[var(--highlight-text)] font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleExecuteCode}
                  className="flex-1 sm:flex-none px-3 py-0.5 text-sm rounded-md 
                    bg-[var(--highlight)] text-[var(--highlight-text)] font-medium"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0 mb-2 lg"> {/* Added mb-6 */}
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
        
        {/* Output */}
        {output && (
          <div className="h-24 lg:h-32 
            bg-[var(--card-background)] border-t border-[var(--border)]">
            <div className="h-full p-3 lg:p-4">
              <div className="h-full overflow-auto rounded-lg 
                bg-[var(--input-background)] 
                text-[var(--text-primary)] 
                border border-[var(--border)] p-3 lg:p-4">
                <pre className="text-sm">{output}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorPage;