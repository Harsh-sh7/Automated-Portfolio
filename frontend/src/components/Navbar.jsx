import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, X, ExternalLink, FolderKanban, Settings } from 'lucide-react';

const sectionMeta = {
  dashboard: { title: 'Dashboard',  sub: 'Overview & Analytics' },
  projects:  { title: 'Projects',   sub: 'Portfolio Showcase'   },
  insights:  { title: 'Insights',   sub: 'Key Findings'         },
  about:     { title: 'About',      sub: 'Background & Skills'  },
};

const DashboardNavbar = ({ activeSection, onSearch, searchQuery, projects = [] }) => {
  const navigate = useNavigate();
  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef(null);
  const { title, sub } = sectionMeta[activeSection] || sectionMeta.dashboard;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-60 right-0 z-30 h-14 flex items-center px-5 gap-4"
      style={{ background: '#0c0c0c', borderBottom: '1px solid #1e1e1e' }}
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-white leading-none">{title}</h1>
        <p className="text-[10px] text-dash-muted mt-0.5">{sub}</p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 pointer-events-none" style={{ color: '#555' }} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          className="pl-9 pr-8 py-2 text-xs rounded-xl transition-all w-52 focus:w-64 focus:outline-none"
          style={{
            background: '#161616',
            border: `1px solid ${searchQuery ? '#6366f1' : '#2a2a2a'}`,
            color: '#f5f5f5',
            boxShadow: searchQuery ? '0 0 0 2px rgba(99,102,241,0.12)' : 'none',
          }}
          onFocus={e  => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.12)'; }}
          onBlur={e   => { if (!searchQuery) { e.target.style.borderColor = '#2a2a2a'; e.target.style.boxShadow = 'none'; } }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2.5 text-dash-muted hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Notification bell with dropdown */}
      <div className="relative" ref={bellRef}>
        <button
          onClick={() => setShowBell(v => !v)}
          className="relative p-2 rounded-xl transition-all"
          style={{
            background: showBell ? '#1e1e1e' : 'transparent',
            border: `1px solid ${showBell ? '#2a2a2a' : 'transparent'}`,
            color: showBell ? '#fff' : '#555',
          }}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* Indigo dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#6366f1', boxShadow: '0 0 4px #6366f180' }}
          />
        </button>

        {showBell && (
          <div
            className="absolute right-0 top-[calc(100%+8px)] w-72 rounded-2xl z-50 overflow-hidden"
            style={{ background: '#111', border: '1px solid #222', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e1e' }}>
              <p className="text-xs font-bold text-white">Notifications</p>
            </div>

            <div className="p-2 space-y-1">
              {/* Portfolio status */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#161616' }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Portfolio is Live</p>
                  <p className="text-[10px] text-dash-muted">All systems operational</p>
                </div>
              </div>

              {/* Projects synced */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#161616' }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <FolderKanban className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">{projects.length} Projects Synced</p>
                  <p className="text-[10px] text-dash-muted">From GitHub via AI summary</p>
                </div>
              </div>

              {/* Search hint — shown when no search */}
              {!searchQuery && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#161616' }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <Search className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">Search Available</p>
                    <p className="text-[10px] text-dash-muted">Type above to find projects</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 pb-3 pt-1">
              <button
                onClick={() => { navigate('/admin/login'); setShowBell(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ background: '#191919', border: '1px solid #2a2a2a' }}
                onMouseEnter={e => e.currentTarget.style.background = '#222'}
                onMouseLeave={e => e.currentTarget.style.background = '#191919'}
              >
                <span>Open Admin Panel</span>
                <ExternalLink className="w-3.5 h-3.5 text-dash-muted" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date */}
      <div
        className="hidden lg:flex items-center px-3 py-1.5 rounded-xl text-[11px] text-dash-muted"
        style={{ background: '#161616', border: '1px solid #1e1e1e' }}
      >
        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Avatar */}
      <button
        onClick={() => navigate('/admin/login')}
        title="Admin Panel"
        className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl transition-all"
        style={{ border: '1px solid transparent' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#191919'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
      >
        <img
          src="https://avatars.githubusercontent.com/Harsh-sh7"
          alt="Profile"
          className="w-6 h-6 rounded-lg object-cover"
          style={{ border: '1px solid #2a2a2a' }}
          onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=H&background=222&color=fff&size=24'; }}
        />
        <span className="text-xs font-medium text-dash-secondary hidden sm:block">Harshit</span>
      </button>
    </header>
  );
};

export default DashboardNavbar;
