import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ContributionGraph from '../components/ContributionGraph';
import { getApprovedProjects } from '../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getApprovedProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-10 flex flex-col md:flex-row w-full">
      <Sidebar />
      <div className="w-full md:w-3/4">
        <ContributionGraph />
        
        <div className="flex items-center justify-between mb-4 border-b border-github-border pb-2">
          <h2 className="text-xl font-bold">Projects</h2>
          <span className="text-sm border border-github-border bg-github-card px-2 py-1 rounded-full text-gray-400">
            {projects.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-10 bg-github-card border border-github-border rounded-xl">
                <p className="text-gray-400">No public projects available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
