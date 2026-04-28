import React, { useState, useEffect } from 'react';
import { MapPin, Mail, GitBranch, Code2, Award } from 'lucide-react';
import axios from 'axios';

const skills = [
  { name: 'Python',             level: 90, color: '#6366f1' },
  { name: 'JavaScript / React', level: 85, color: '#06b6d4' },
  { name: 'Node.js',            level: 75, color: '#10b981' },
  { name: 'SQL / MongoDB',      level: 80, color: '#f59e0b' },
  { name: 'Machine Learning',   level: 70, color: '#ec4899' },
  { name: 'Tableau / Power BI', level: 65, color: '#6366f1' },
  { name: 'Docker / CI/CD',     level: 60, color: '#06b6d4' },
];

const timeline = [
  { year: '2024', title: 'Data Analytics Portfolio', desc: 'Built full-stack analytics portfolio with AI-driven project summaries.', color: '#6366f1' },
  { year: '2024', title: 'ML Projects',              desc: 'Developed multiple ML pipelines for classification and NLP tasks.',        color: '#06b6d4' },
  { year: '2023', title: 'Full-Stack Development',   desc: 'Mastered React, Node.js, and cloud deployments.',                          color: '#10b981' },
  { year: '2022', title: 'Started Coding Journey',   desc: 'Began with Python, data structures, and algorithms.',                      color: '#f59e0b' },
];

const AboutSection = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('https://api.github.com/users/Harsh-sh7')
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile({
        avatar_url:   'https://avatars.githubusercontent.com/Harsh-sh7',
        name:         'Harshit Shakya',
        login:        'Harsh-sh7',
        bio:          'Full-stack developer & data analyst passionate about scalable applications and data insights.',
        followers:    0, following: 0, public_repos: 0, location: 'India',
      }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">

      {/* Profile card */}
      <div className="glass-card p-6 flex flex-col items-center text-center gap-4">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-lg opacity-30"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', transform: 'scale(1.1)' }}
          />
          <img
            src={profile?.avatar_url || 'https://avatars.githubusercontent.com/Harsh-sh7'}
            alt="Harshit Shakya"
            className="relative w-20 h-20 rounded-2xl object-cover"
            style={{ border: '1px solid #2a2a2a' }}
            onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=H+S&background=1a1a1a&color=fff&size=80'; }}
          />
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse"
            style={{ background: '#10b981', borderColor: '#080808', boxShadow: '0 0 6px #10b98180' }}
          />
        </div>

        <div>
          <h2 className="text-base font-bold text-white">{profile?.name || 'Harshit Shakya'}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#6366f1' }}>@{profile?.login || 'Harsh-sh7'}</p>
          <p className="text-[11px] text-dash-muted mt-3 leading-relaxed">
            {profile?.bio || 'Full-stack developer & data analyst.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 w-full py-3 gap-2"
          style={{ borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e' }}
        >
          {[
            { val: profile?.followers ?? '--',    label: 'Followers', color: '#6366f1' },
            { val: profile?.public_repos ?? '--', label: 'Repos',     color: '#06b6d4' },
            { val: profile?.following ?? '--',    label: 'Following',  color: '#10b981' },
          ].map(({ val, label, color }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold" style={{ color }}>{val}</p>
              <p className="text-[9px] text-dash-muted uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2 w-full text-xs text-dash-secondary">
          {profile?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ec4899' }} />
            <a href="mailto:harshakya56@gmail.com" className="hover:text-white transition-colors truncate">
              harshakya56@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6366f1' }} />
            <a href="https://github.com/Harsh-sh7" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              github.com/Harsh-sh7
            </a>
          </div>
        </div>

        {/* CTA */}
        <a
          href="mailto:harshakya56@gmail.com"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
        >
          <Mail className="w-3.5 h-3.5" />
          Get in Touch
        </a>
      </div>

      {/* Right column */}
      <div className="lg:col-span-2 flex flex-col gap-5">

        {/* Skills */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4" style={{ color: '#06b6d4' }} />
            <h3 className="text-sm font-semibold text-white">Technical Proficiency</h3>
          </div>
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={skill.name} className="animate-slide-up" style={{ animationDelay: `${i * 55}ms` }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-dash-secondary">{skill.name}</span>
                  <span className="text-[11px] font-bold" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <div className="h-[3px] rounded-full" style={{ background: '#1e1e1e' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}60, ${skill.color})`,
                      boxShadow: `0 0 8px ${skill.color}40`,
                      transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <h3 className="text-sm font-semibold text-white">Journey</h3>
          </div>
          <div className="relative pl-5" style={{ borderLeft: '1px solid #2a2a2a' }}>
            <div className="space-y-5">
              {timeline.map((item, i) => (
                <div key={i} className="relative animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <div
                    className="absolute -left-[22px] top-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: item.color, borderColor: '#080808', boxShadow: `0 0 6px ${item.color}60` }}
                  />
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}
                    >
                      {item.year}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.title}</p>
                      <p className="text-[11px] text-dash-muted mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
