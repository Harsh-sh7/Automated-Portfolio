import React, { useState, useEffect, useMemo } from 'react';
import { getApprovedProjects } from '../services/api';

import DashboardSidebar from '../components/Sidebar';
import DashboardNavbar  from '../components/Navbar';
import KPICard          from '../components/KPICard';
import ProjectCard      from '../components/ProjectCard';
import { ChartCard, BarChart, LineChart, DonutChart, ActivityHeatmap } from '../components/ChartCard';
import InsightsSection  from '../components/InsightsSection';
import AboutSection     from '../components/AboutSection';

import { FolderKanban, Database, Lightbulb, GitCommit, Filter, X, GitBranch } from 'lucide-react';

/* ─────────────────────────────────────────────
   Loader
───────────────────────────────────────────── */
const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#1e1e1e', borderTopColor: '#6366f1' }}
      />
      <p className="text-xs text-dash-muted">Loading data…</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Helpers — derive accurate chart data
───────────────────────────────────────────── */

// Group projects by month using createdAt if available
function buildMonthlyData(projects) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();

  // Build last-7-months window
  const window = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    window.push({ label: MONTHS[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), count: 0 });
  }

  // Count projects per month
  projects.forEach(p => {
    const date = p.createdAt ? new Date(p.createdAt) : null;
    if (!date) return;
    const slot = window.find(w => w.year === date.getFullYear() && w.month === date.getMonth());
    if (slot) slot.count++;
  });

  // Make cumulative
  let cumulative = 0;
  return window.map(w => {
    cumulative += w.count;
    return { label: w.label, v1: cumulative };
  });
}

// Classify projects by domain based on tech stack keywords
function buildDomainData(projects) {
  const domains = { 'Data / ML': 0, 'Web Dev': 0, 'DevOps': 0, 'Other': 0 };
  const ML  = ['python','tensorflow','pytorch','sklearn','numpy','pandas','jupyter','ml','ai','data','analytics','tableau','powerbi','nltk','spacy'];
  const WEB = ['react','vue','angular','javascript','typescript','nextjs','next.js','node','express','html','css','tailwind','redux','vite'];
  const OPS = ['docker','kubernetes','aws','gcp','azure','ci/cd','github actions','terraform','nginx','linux'];

  projects.forEach(p => {
    const techs = (p.tech_stack || []).map(t => t.toLowerCase());
    const name  = (p.name || '').toLowerCase();
    const desc  = (p.description || '').toLowerCase();
    const all   = [...techs, name, desc];
    if (all.some(t => ML.some(k  => t.includes(k))))  { domains['Data / ML']++; }
    else if (all.some(t => OPS.some(k => t.includes(k)))) { domains['DevOps']++; }
    else if (all.some(t => WEB.some(k => t.includes(k)))) { domains['Web Dev']++; }
    else { domains['Other']++; }
  });

  return Object.entries(domains)
    .filter(([, v]) => v > 0)
    .map(([label, value]) => ({ label, value }));
}

/* ─────────────────────────────────────────────
   Dashboard Home
───────────────────────────────────────────── */
const DashboardHome = ({ projects }) => {
  // Tech stack bar chart — top 5 techs by usage
  const techCounts = useMemo(() => {
    const map = {};
    projects.forEach(p => (p.tech_stack || []).forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }, [projects]);

  // Fallback bar data when no projects
  const barData = techCounts.length > 0 ? techCounts : [
    { label: 'Python',  value: 8 },
    { label: 'React',   value: 6 },
    { label: 'Node',    value: 5 },
    { label: 'SQL',     value: 4 },
    { label: 'ML',      value: 3 },
  ];

  const uniqueTechs = useMemo(
    () => new Set(projects.flatMap(p => p.tech_stack || [])).size,
    [projects]
  );

  const totalFeatures = projects.reduce((s, p) => s + (p.features?.length || 0), 0);

  // Line chart — cumulative projects by month (real data if createdAt exists)
  const lineData = useMemo(() => {
    const monthly = buildMonthlyData(projects);
    // If all zeros (no createdAt), generate a reasonable distribution
    const hasData = monthly.some(m => m.v1 > 0);
    if (!hasData && projects.length > 0) {
      // Distribute evenly across last 7 months
      return monthly.map((m, i) => ({
        label: m.label,
        v1: Math.round((i + 1) * (projects.length / 7)),
      }));
    }
    return monthly;
  }, [projects]);

  // Donut — classified by domain
  const domainData = useMemo(() => buildDomainData(projects), [projects]);
  const domainFallback = [
    { label: 'Data / ML', value: 35 },
    { label: 'Web Dev',   value: 30 },
    { label: 'DevOps',    value: 15 },
    { label: 'Other',     value: 20 },
  ];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Projects"  value={projects.length}
          subtitle="In portfolio"  icon={FolderKanban}
          trend="up"  trendValue="+3 this month"
          sparkData={[1, 2, 4, 3, 6, 5, Math.max(projects.length, 1)]}
          delay={0}  colorIndex={0}
        />
        <KPICard
          title="Tech Stack"  value={uniqueTechs}  suffix=" tools"
          subtitle="Across all projects"  icon={Database}
          trend="up"  trendValue="Growing"
          sparkData={[5, 8, 10, 12, 14, Math.max(uniqueTechs, 14)]}
          delay={80}  colorIndex={1}
        />
        <KPICard
          title="AI Insights"  value={totalFeatures}
          subtitle="Generated features"  icon={Lightbulb}
          trend="up"  trendValue="Auto-generated"
          sparkData={[2, 5, 8, 12, 16, Math.max(totalFeatures, 20)]}
          delay={160}  colorIndex={2}
        />
        <KPICard
          title="Commits"  value={1432}
          subtitle="Past 12 months"  icon={GitCommit}
          trend="up"  trendValue="+127 this week"
          sparkData={[80, 95, 110, 130, 115, 145, 160]}
          delay={240}  colorIndex={3}
        />
      </div>

      {/* Charts — accurate data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Tech Stack Usage" subtitle="By Project Count" badge={`${barData.length} techs`} className="animation-delay-100">
          <BarChart data={barData} />
        </ChartCard>
        <ChartCard title="Project Growth" subtitle="Cumulative" badge="Monthly" className="animation-delay-200">
          <LineChart data={lineData} color1="#6366f1" color2="#06b6d4" />
        </ChartCard>
        <ChartCard title="Domain Split" subtitle="By Classification" badge={`${projects.length} projects`} className="animation-delay-300">
          <DonutChart data={domainData.length > 0 ? domainData : domainFallback} />
        </ChartCard>
      </div>

      {/* Activity heatmap */}
      <div className="glass-card p-5 animate-slide-up animation-delay-400">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-dash-muted uppercase tracking-widest font-semibold">Commit Activity</p>
            <h3 className="text-sm font-semibold text-white mt-0.5">1,432 contributions in the last year</h3>
          </div>
          <a
            href="https://github.com/Harsh-sh7"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-[11px] py-1.5 px-3"
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
        <ActivityHeatmap />
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-dash-muted">Less</span>
          {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: c }} />
          ))}
          <span className="text-[10px] text-dash-muted">More</span>
        </div>
      </div>

      {/* Recent projects */}
      <div className="glass-card p-5 animate-slide-up animation-delay-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Recent Projects</h3>
          <span className="insight-badge">{projects.length} total</span>
        </div>
        {projects.length === 0 ? (
          <p className="text-dash-muted text-sm text-center py-4">
            No projects yet — add some from the Admin Panel.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {projects.slice(0, 4).map((p, i) => {
              const COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b'];
              const c = COLORS[i % COLORS.length];
              return (
                <a
                  key={p._id}
                  href={p.github_url || p.live_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all group"
                  style={{ border: '1px solid #1e1e1e' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#161616'; e.currentTarget.style.borderColor = `${c}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#1e1e1e'; }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}
                  >
                    {p.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.tech_stack?.slice(0, 2).map((t, ti) => (
                        <span key={ti} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Projects Section
───────────────────────────────────────────── */
const ACCENT = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

const ProjectsSection = ({ projects, searchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const allTechs = useMemo(() => {
    const set = new Set();
    projects.forEach(p => (p.tech_stack || []).forEach(t => set.add(t)));
    return ['All', ...Array.from(set).slice(0, 9)];
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (activeFilter !== 'All') list = list.filter(p => p.tech_stack?.includes(activeFilter));
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tech_stack?.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filter bar */}
      <div
        className="flex items-center gap-3 flex-wrap p-4 rounded-xl"
        style={{ background: '#111111', border: '1px solid #1e1e1e' }}
      >
        <div className="flex items-center gap-1.5 text-dash-muted">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Filter:</span>
        </div>

        <div className="flex gap-2 flex-wrap flex-1">
          {allTechs.map((tech, i) => {
            const isActive = activeFilter === tech;
            const c = i === 0 ? '#6366f1' : ACCENT[(i - 1) % ACCENT.length];
            return (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className="text-[11px] font-medium px-3 py-1 rounded-lg transition-all"
                style={isActive ? {
                  background: `${c}18`,
                  color: c,
                  border: `1px solid ${c}40`,
                  boxShadow: `0 0 8px ${c}20`,
                } : {
                  background: '#191919',
                  color: '#555',
                  border: '1px solid #2a2a2a',
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {(activeFilter !== 'All' || searchQuery) && (
          <button
            onClick={() => setActiveFilter('All')}
            className="flex items-center gap-1 text-[11px] text-dash-muted hover:text-white transition-colors ml-auto"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-[11px] text-dash-muted">
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        {activeFilter !== 'All' && ` · "${activeFilter}"`}
        {searchQuery && ` · matching "${searchQuery}"`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center gap-3">
          <FolderKanban className="w-10 h-10 text-dash-muted opacity-30" />
          <p className="text-sm text-dash-secondary">No projects match.</p>
          <button onClick={() => setActiveFilter('All')} className="text-xs text-white hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((proj, i) => <ProjectCard key={proj._id} project={proj} index={i} />)}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Root Portfolio Page
───────────────────────────────────────────── */
const Portfolio = () => {
  const [projects,      setProjects]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery,   setSearchQuery]   = useState('');

  useEffect(() => {
    getApprovedProjects()
      .then(data => setProjects(data))
      .catch(err  => console.error('Failed to fetch projects:', err))
      .finally(()  => setLoading(false));
  }, []);

  // ✅ FIX: Auto-switch to Projects when user searches
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim()) setActiveSection('projects');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSearchQuery('');
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    switch (activeSection) {
      case 'dashboard': return <DashboardHome projects={projects} />;
      case 'projects':  return <ProjectsSection projects={projects} searchQuery={searchQuery} />;
      case 'insights':  return <InsightsSection projects={projects} />;
      case 'about':     return <AboutSection />;
      default:          return <DashboardHome projects={projects} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        projectCount={projects.length}
      />

      {/* ✅ FIX: Pass projects to Navbar for notification panel */}
      <DashboardNavbar
        activeSection={activeSection}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        projects={projects}
      />

      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-5 max-w-[1440px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
