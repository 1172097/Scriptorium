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
      className="cursor-pointer bg-[var(--card-background)] text-[var(--text-primary)] 
                 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">
            {template.title}
          </span>
        </div>
        <div className="flex items-center space-x-4">
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
        <p className="mb-4 truncate">
          {template.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-sm rounded-lg bg-[var(--highlight)] opacity-80">
            {template.language}
          </span>
          {template.tags?.map((tag) => (
            <span 
              key={tag.id} 
              className="px-3 py-1 text-sm rounded-lg bg-[var(--highlight)] opacity-80"
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
          <span className="text-sm">
            by {template.author.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;