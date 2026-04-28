import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Lightbulb, User,
  BarChart3, Settings,
} from 'lucide-react';

// Each nav section has its own semantic accent color
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#6366f1' },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban,    color: '#06b6d4' },
  { id: 'insights',  label: 'Insights',  icon: Lightbulb,       color: '#10b981' },
  { id: 'about',     label: 'About',     icon: User,            color: '#f59e0b' },
];

// Proficiency bars — each with its own color
const skills = [
  { label: 'Python',      pct: 90, color: '#6366f1' },
  { label: 'JavaScript',  pct: 85, color: '#06b6d4' },
  { label: 'React',       pct: 80, color: '#10b981' },
  { label: 'Node.js',     pct: 75, color: '#f59e0b' },
  { label: 'SQL',         pct: 70, color: '#ec4899' },
];

const DashboardSidebar = ({ activeSection, onSectionChange, projectCount }) => {
  const navigate = useNavigate();
  const activeColor = navItems.find(n => n.id === activeSection)?.color || '#6366f1';

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 z-40 flex flex-col"
      style={{ background: '#0c0c0c', borderRight: '1px solid #1e1e1e' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: activeColor, boxShadow: `0 0 12px ${activeColor}50` }}
        >
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">DataFolio</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#10b981', boxShadow: '0 0 4px #10b98160' }}
            />
            <span className="text-[10px] text-dash-muted font-medium">Portfolio</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-dash-muted uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>

        {navItems.map(({ id, label, icon: Icon, color }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className="nav-item w-full text-left"
              style={isActive ? {
                background: `${color}12`,
                color: color,
                border: `1px solid ${color}30`,
              } : {}}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? color : '#555' }}
              />
              <span className="flex-1">{label}</span>
              {id === 'projects' && projectCount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={isActive
                    ? { background: `${color}20`, color: color }
                    : { background: '#1e1e1e', color: '#555' }
                  }
                >
                  {projectCount}
                </span>
              )}
              {isActive && (
                <span
                  className="absolute left-0 top-[18%] h-[64%] w-[3px] rounded-r-full"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
              )}
            </button>
          );
        })}

        <div className="section-divider my-3" />

        <p className="text-[10px] font-semibold text-dash-muted uppercase tracking-widest px-3 mb-2">
          Proficiency
        </p>

        <div className="px-3 space-y-3">
          {skills.map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-dash-secondary">{label}</span>
                <span className="text-[11px] font-semibold" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-[3px] rounded-full" style={{ background: '#1e1e1e' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                    boxShadow: `0 0 6px ${color}40`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Profile strip */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #1e1e1e' }}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: '#161616', border: '1px solid #222' }}
        >
          <img
            src="https://avatars.githubusercontent.com/Harsh-sh7"
            alt="Profile"
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=H&background=222&color=fff&size=32'; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white leading-none truncate">Harshit Shakya</p>
            <p className="text-[10px] text-dash-muted mt-0.5">Full-Stack Dev</p>
          </div>
          <button
            onClick={() => navigate('/admin/login')}
            title="Admin Panel"
            className="p-1.5 rounded-lg transition-all flex-shrink-0"
            style={{ color: '#555' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#222'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
