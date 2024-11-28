import React, { useState } from "react";

interface EditableDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

const EditableDescription: React.FC<EditableDescriptionProps> = ({ description, setDescription }) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  return (
    <div className="relative">
      {isEditingDescription ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setIsEditingDescription(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              setIsEditingDescription(false);
            }
          }}
          className="w-full resize-none
            bg-[#FEF7FF] dark:bg-[#3F384C] 
            text-[#6A5294] dark:text-[#D4BBFF] 
            border border-[#6A529433] dark:border-[#D4BBFF33] 
            rounded-lg px-2 py-1"
          rows={3}
          autoFocus
          dir="ltr"
        />
      ) : (
        <div className="flex items-start flex-wrap">
          <p className="text-[#6A5294] dark:text-[#D4BBFF] w-full whitespace-pre-wrap">
            {description || 'Add a description...'}
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
};

export default EditableDescription;
