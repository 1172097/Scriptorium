import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import Navbar from "@/components/NavBar";
import EditableDescription from "@/components/TemplateEditor";

interface Tag {
  id: number;
  name: string;
}

const ForkTemplatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [code, setCode] = useState(``);
  const [theme, setTheme] = useState('light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [originalTemplateId, setOriginalTemplateId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/templates/view?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch template');
        }
        
        const data = await response.json();
        
        // Set all the template data for forking
        setTitle(`Fork of ${data.title}`);
        setDescription(data.description || '');
        setCode(data.content || '');
        setLanguage(data.language || 'python');
        
        // Safely handle tags array
        const templateTags = data.tags?.map((tag: Tag) => tag.name) || [];
        setTags(templateTags);
        
        // Store the original template ID for forking
        setOriginalTemplateId(data.id);
      } catch (error) {
        console.error('Error fetching template:', error);
        alert('Failed to load template');
      }
    };

    fetchTemplate();
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
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

  const forkTemplate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/templates/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isForked: true,
          title,
          description,
          content: code,
          language,
          originTemplateId: originalTemplateId,
          tags: tags.filter(tag => tag.trim() !== '')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fork template');
      }

      const data = await response.json();
      alert('Template forked successfully!');
      // Redirect to home page instead of template view
      router.push('/');
    } catch (error) {
      console.error('Error forking template:', error);
      alert('Failed to fork template');
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
              <EditableDescription description={description} setDescription={setDescription} />
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
                onClick={forkTemplate}
                className="px-3 py-0.5 text-sm rounded-md bg-[#6A5294] dark:bg-[#D4BBFF] 
                  text-white dark:text-[#3F384C] font-medium"
              >
                Fork
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

export default ForkTemplatePage;