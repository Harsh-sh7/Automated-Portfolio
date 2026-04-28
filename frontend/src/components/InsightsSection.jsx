import React from 'react';
import { TrendingUp, Zap, Globe, Users, ArrowRight, Clock } from 'lucide-react';
import { ChartCard, BarChart, LineChart, DonutChart } from './ChartCard';

const ACCENT = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

const techStackData = [
  { label: 'Python',  value: 8 },
  { label: 'React',   value: 6 },
  { label: 'Node',    value: 5 },
  { label: 'SQL',     value: 4 },
  { label: 'ML',      value: 3 },
];

const activityData = [
  { label: 'Jan', v1: 2, v2: 1 },
  { label: 'Feb', v1: 3, v2: 2 },
  { label: 'Mar', v1: 5, v2: 3 },
  { label: 'Apr', v1: 4, v2: 4 },
  { label: 'May', v1: 7, v2: 5 },
  { label: 'Jun', v1: 6, v2: 4 },
  { label: 'Jul', v1: 9, v2: 6 },
];

const domainData = [
  { label: 'Data Science', value: 35 },
  { label: 'Web Dev',       value: 30 },
  { label: 'ML / AI',       value: 20 },
  { label: 'DevOps',        value: 15 },
];

const keyInsights = [
  { icon: TrendingUp, color: '#6366f1', title: 'Rapid Growth',    desc: 'Project output increased 3× over 6 months, with a focus on ML and data pipelines.' },
  { icon: Zap,        color: '#06b6d4', title: 'Full-Stack Depth', desc: 'Covers the full data lifecycle — ingestion, processing, visualization, and deployment.' },
  { icon: Globe,      color: '#10b981', title: 'Live Deployments', desc: 'Multiple projects production-deployed with CI/CD pipelines and active user traffic.' },
  { icon: Users,      color: '#f59e0b', title: 'Open Source',      desc: 'All repositories publicly available for collaboration, forking, and learning.' },
];

const InsightsSection = ({ projects }) => (
  <div className="space-y-5 animate-fade-in">
    {/* Insight cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {keyInsights.map((item, i) => (
        <div
          key={i}
          className="glass-card glass-card-hover p-4 flex flex-col gap-3 animate-slide-up"
          style={{ animationDelay: `${i * 70}ms`, borderColor: `${item.color}25` }}
        >
          <div
            className="p-2 rounded-lg w-fit"
            style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
          >
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">{item.title}</h4>
            <p className="text-[11px] text-dash-secondary mt-1 leading-relaxed">{item.desc}</p>
          </div>
          {/* Accent bottom line */}
          <div className="h-[2px] rounded-full mt-auto" style={{ background: `linear-gradient(90deg, ${item.color}60, transparent)` }} />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ChartCard title="Tech Stack Usage" subtitle="Distribution" badge="Top 5" className="animation-delay-100">
        <BarChart data={techStackData} />
      </ChartCard>
      <ChartCard title="Project Activity" subtitle="Over Time" badge="2024" className="animation-delay-200">
        <LineChart data={activityData} color1="#6366f1" color2="#06b6d4" />
      </ChartCard>
      <ChartCard title="Domain Focus" subtitle="Breakdown" badge="Areas" className="animation-delay-300">
        <DonutChart data={domainData} />
      </ChartCard>
    </div>

    {/* Recent activity */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: '#06b6d4' }} />
          <h3 className="text-sm font-semibold text-white">Recent Project Activity</h3>
        </div>
        <span className="insight-badge">{projects.length} Projects</span>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-dash-muted text-sm py-6">No projects yet.</p>
      ) : (
        <div className="space-y-1">
          {projects.slice(0, 6).map((p, i) => {
            const c = ACCENT[i % ACCENT.length];
            return (
              <a
                key={p._id}
                href={p.github_url || p.live_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl transition-all group"
                style={{ borderBottom: i < Math.min(projects.length, 6) - 1 ? '1px solid #1a1a1a' : 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#161616'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${c}15`, color: c, border: `1px solid ${c}30` }}
                >
                  {p.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-dash-muted truncate">
                    {p.tech_stack?.slice(0, 3).join(' · ') || 'No tech listed'}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-dash-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

export default InsightsSection;
