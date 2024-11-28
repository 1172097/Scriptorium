import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/NavBar";

const CodeEditorPage = () => {
  const [code, setCode] = useState(``);

  const [theme, setTheme] = useState('light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['']);
  const [newTag, setNewTag] = useState('');

  // Edit state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
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

  const EditableDescription = () => (
    <div className="relative">
      {isEditingDescription ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setIsEditingDescription(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditingDescription(false)}
          className="w-full 
            bg-[#FEF7FF] dark:bg-[#3F384C] 
            text-[#6A5294] dark:text-[#D4BBFF] 
            border border-[#6A529433] dark:border-[#D4BBFF33] 
            rounded-lg px-2 py-1"
          rows={3}
          autoFocus
        />
      ) : (
        <div className="flex items-start">
          <p className="text-[#6A5294] dark:text-[#D4BBFF] flex-grow mr-2">
            {description}
          </p>
          <button 
            onClick={() => setIsEditingDescription(true)} 
            className="text-[#6A5294] dark:text-[#D4BBFF] 
            opacity-50 hover:opacity-100 
            transition-opacity duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState(''); // Add this new state

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

  return ( 
    <div className="min-h-screen bg-[#FEF7FF] dark:bg-[#3F384C] transition-colors duration-300">
      <Navbar />
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          <aside className="w-1/2 p-6 flex flex-col space-y-6 
            bg-white dark:bg-[#2D2640] 
            shadow-lg 
            transition-colors duration-300">
            <header>
              <EditableTitle />
            </header>
            <section>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-block px-4 py-1 rounded-full 
                      bg-[#6A5294] dark:bg-[#D4BBFF] 
                      text-white dark:text-[#3F384C] 
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
                      bg-[#FEF7FF] dark:bg-[#3F384C] 
                      text-[#6A5294] dark:text-[#D4BBFF] 
                      border border-[#6A529433] dark:border-[#D4BBFF33] 
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
              <EditableDescription />
            </section>
          </aside>
          <section className="w-1/2 p-6 
            bg-white dark:bg-[#2D2640] 
            shadow-lg 
            transition-colors duration-300">
            <div className="flex justify-end gap-2 mb-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-1.5 py-0.5 text-sm rounded-md border border-[#6A529433] dark:border-[#D4BBFF33] 
                  bg-[#FEF7FF] dark:bg-[#3F384C] text-[#6A5294] dark:text-[#D4BBFF]"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
                <option value="rust">Rust</option>
                <option value="cpp">C++</option>
                <option value="golang">Golang</option>
              </select>
              <button
                onClick={createTemplate}
                className="px-3 py-0.5 text-sm rounded-md bg-[#6A5294] dark:bg-[#D4BBFF] 
                  text-white dark:text-[#3F384C] font-medium"
              >
                Save
              </button>
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
            {/* Add input section below editor */}
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
        
        {/* New output section at bottom */}
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

export default CodeEditorPage;