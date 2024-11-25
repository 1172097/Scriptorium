import React from 'react';

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

interface TemplateCardProps {
  template: CodeTemplate;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div 
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
  );
};

export default TemplateCard;