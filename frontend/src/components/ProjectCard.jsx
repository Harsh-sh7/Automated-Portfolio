import React from 'react';
import { ExternalLink, GitBranch, Zap, ArrowUpRight, Tag } from 'lucide-react';

const CARD_ACCENTS = [
  { color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)'  },
  { color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)'   },
  { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  { color: '#ec4899', bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.2)'  },
];

const deriveInsight = (project) => {
  if (project.features?.length > 0) return project.features[0];
  if (project.description) {
    const words = project.description.split(' ');
    return words.slice(0, 14).join(' ') + (words.length > 14 ? '…' : '');
  }
  return 'Modern full-stack architecture with scalable design patterns.';
};

const ProjectCard = ({ project, index = 0 }) => {
  const acc       = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const insight   = deriveInsight(project);
  const techCount = project.tech_stack?.length || 0;
  const primaryLink = project.live_url || project.github_url || '#';
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5 animate-slide-up transition-all duration-300 group"
      style={{
        background: '#111111',
        border: `1px solid #1e1e1e`,
        animationDelay: `${(index % 6) * 60}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#161616';
        e.currentTarget.style.borderColor = acc.border;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.4), 0 0 20px ${acc.color}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#111111';
        e.currentTarget.style.borderColor = '#1e1e1e';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image Section */}
      {project.image_url ? (
        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden group/img">
          <img 
            src={project.image_url.startsWith('http') ? project.image_url : `${API_BASE_URL}${project.image_url}`} 
            alt={project.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div 
          className="w-full h-32 mb-4 rounded-xl flex items-center justify-center border border-dashed border-white/10 bg-white/5"
        >
          <Tag className="w-6 h-6 text-dash-muted opacity-20" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: acc.color, boxShadow: `0 0 10px ${acc.color}` }}
          />
          <h3 className="font-bold text-white text-[15px] leading-snug truncate">
            {project.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1.5 rounded-lg text-dash-muted transition-all hover:text-white"
              title="Live Demo"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.color = acc.color; e.currentTarget.style.background = acc.bg; }}
              onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1.5 rounded-lg text-dash-muted transition-all hover:text-white"
              title="View Code"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#222'; }}
              onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <GitBranch className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 flex-grow overflow-y-auto max-h-32 custom-scrollbar">
        <p className="text-[12.5px] text-dash-secondary leading-relaxed font-medium">
          {project.description || 'A modern project built with scalable architecture and best practices.'}
        </p>
      </div>

      {/* Key insight */}
      <div
        className="flex items-start gap-2 rounded-xl p-3 mb-4 backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ 
          background: `linear-gradient(135deg, ${acc.bg}, rgba(0,0,0,0.2))`, 
          border: `1px solid ${acc.border}`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.1)`
        }}
      >
        <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: acc.color }} />
        <p className="text-[11px] font-medium leading-relaxed" style={{ color: acc.color }}>
          <span className="font-bold text-white/90">Insight: </span>{insight}
        </p>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech_stack?.slice(0, 4).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
        {techCount > 4 && (
          <span className="tech-tag">+{techCount - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1e1e1e' }}>
        <div className="flex items-center gap-1.5 text-[10px] text-dash-muted">
          <Tag className="w-3 h-3" />
          <span>{techCount} tools</span>
        </div>

        <a
          href={primaryLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: acc.bg, border: `1px solid ${acc.border}`, color: acc.color }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${acc.color}25`;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = acc.bg;
            e.currentTarget.style.transform = '';
          }}
        >
          View Dashboard
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
