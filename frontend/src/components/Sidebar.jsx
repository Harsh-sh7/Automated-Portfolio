import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, MessageSquare, Briefcase, Mail, MapPin, Link as LinkIcon } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/4 pr-0 md:pr-8 mb-8 md:mb-0">
      <img src="https://avatars.githubusercontent.com/u/9919?v=4" alt="Profile" className="w-64 h-64 rounded-full border border-github-border mb-6 shadow-lg object-cover" />
      <h1 className="text-2xl font-bold mb-1">Developer Name</h1>
      <h2 className="text-xl text-gray-400 mb-4 font-light">username</h2>
      <p className="mb-6 text-sm">Full-stack developer passionate about building scalable web applications and exploring new technologies.</p>
      
      <button 
        onClick={() => navigate('/admin/dashboard')}
        className="w-full py-1.5 mb-6 bg-github-card border border-github-border rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Edit Profile
      </button>

      <div className="flex flex-col gap-2 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> San Francisco, CA</div>
        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@example.com</div>
        <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> <a href="#" className="hover:text-github-accent transition-colors">example.com</a></div>
      </div>

      <div className="border-t border-github-border pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'MongoDB', 'Tailwind CSS'].map(skill => (
            <span key={skill} className="px-2 py-1 text-xs bg-github-card border border-github-border rounded-full text-github-accent">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 border-t border-github-border pt-6 text-gray-400">
        <a href="#" className="hover:text-github-accent transition-colors"><Code className="w-5 h-5" /></a>
        <a href="#" className="hover:text-github-accent transition-colors"><MessageSquare className="w-5 h-5" /></a>
        <a href="#" className="hover:text-github-accent transition-colors"><Briefcase className="w-5 h-5" /></a>
      </div>
    </div>
  );
};

export default Sidebar;
