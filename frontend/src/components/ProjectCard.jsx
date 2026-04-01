import React from 'react';
import { FolderGit2, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-github-card border border-github-border rounded-xl p-5 hover:border-gray-500 transition-all shadow-md flex flex-col h-full group">
      <div className="flex justify-between items-start mb-2 border-b border-github-border pb-3">
        <h3 className="text-lg font-bold text-github-accent group-hover:underline cursor-pointer">
          <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-gray-400" />
            {project.name}
          </a>
        </h3>
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-4 flex-grow">
        {project.description || 'No description provided.'}
      </p>

      {project.features && project.features.length > 0 && (
        <ul className="list-disc text-xs text-gray-500 mb-4 min-h-[3rem] ml-4 flex flex-col gap-1">
          {project.features.slice(0, 3).map((feat, i) => (
            <li key={i} className="leading-snug text-wrap break-words pr-2">{feat}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-auto pt-4">
        {project.tech_stack?.slice(0, 3).map((tech, i) => (
          <span key={i} className="px-2 py-0.5 text-xs rounded-full border border-github-border bg-[#0d1117] text-gray-300">
            {tech}
          </span>
        ))}
        {project.tech_stack?.length > 3 && (
          <span className="px-2 py-0.5 text-xs rounded-full border border-github-border bg-[#0d1117] text-gray-500">
            +{project.tech_stack.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
