import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, MessageSquare, Briefcase, Mail, MapPin, Link as LinkIcon, Users } from 'lucide-react';
import axios from 'axios';

const Sidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('https://api.github.com/users/Harsh-sh7');
        setProfile(data);
      } catch (err) {
        console.error("Failed to load GitHub profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="w-full md:w-1/4 pr-0 md:pr-8 mb-8 md:mb-0 text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="w-full md:w-1/4 pr-0 md:pr-8 mb-8 md:mb-0">
      <img src={profile.avatar_url} alt="Profile" className="w-64 h-64 rounded-full border border-github-border mb-6 shadow-lg object-cover" />
      <h1 className="text-2xl font-bold mb-1">{profile.name || profile.login}</h1>
      <h2 className="text-xl text-gray-400 mb-4 font-light">{profile.login}</h2>
      <p className="mb-6 text-sm">{profile.bio || 'Full-stack developer passionate about building scalable web applications and exploring new technologies.'}</p>
      
      <button 
        onClick={() => navigate('/admin/dashboard')}
        className="w-full py-1.5 mb-6 bg-github-card border border-github-border rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Edit Profile
      </button>

      <div className="flex flex-col gap-2 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-2"><Users className="w-4 h-4" /> <span className="font-semibold text-white">{profile.followers}</span> followers · <span className="font-semibold text-white">{profile.following}</span> following</div>
        {profile.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location}</div>}
        {profile.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> <a href={`mailto:${profile.email}`} className="hover:text-github-accent transition-colors">{profile.email}</a></div>}
        {profile.blog && <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="hover:text-github-accent transition-colors">{profile.blog}</a></div>}
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
    </div>
  );
};

export default Sidebar;
