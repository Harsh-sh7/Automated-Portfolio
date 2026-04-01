import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProject, approveProject, rejectProject, getDashboardData, importGithubProject } from '../services/api';
import toast from 'react-hot-toast';
import { LogOut, Trash, CheckCircle, XCircle, DownloadCloud, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState({ added: [], notAdded: [] });
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(null);
  
  // Edit state
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', live_url: '', features: '', tech_stack: '' });
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await approveProject(id);
      if (action === 'reject') await rejectProject(id);
      if (action === 'delete') await deleteProject(id);
      toast.success(`Project ${action}d successfully`);
      fetchData();
    } catch (err) {
      toast.error(`Failed to ${action} project`);
    }
  };

  const handleImport = async (owner, repo) => {
    setImporting(repo);
    const loadingToast = toast.loading(`Summarizing ${repo} with Gemini AI...`);
    try {
      await importGithubProject(owner, repo);
      toast.success(`${repo} imported to Portfolio!`, { id: loadingToast });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to import ${repo}`, { id: loadingToast });
    } finally {
      setImporting(null);
    }
  };

  const handleEditClick = (proj) => {
    setEditingProject(proj);
    setEditForm({
      name: proj.name || '',
      description: proj.description || '',
      live_url: proj.live_url || '',
      features: proj.features ? proj.features.join(', ') : '',
      tech_stack: proj.tech_stack ? proj.tech_stack.join(', ') : ''
    });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        live_url: editForm.live_url,
        features: editForm.features.split(',').map(f => f.trim()).filter(f => f),
        tech_stack: editForm.tech_stack.split(',').map(t => t.trim()).filter(t => t)
      };
      
      const { updateProject } = require('../services/api');
      await updateProject(editingProject._id, payload);
      toast.success('Project updated successfully');
      setEditingProject(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400 text-lg">Loading sync from GitHub...</div>;


  return (
    <div className="min-h-screen bg-github-bg text-github-text p-8 pb-20">
      <div className="flex justify-between items-center mb-8 border-b border-github-border pb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-green-400">Added to Portfolio</h2>
      <div className="bg-github-card border border-github-border rounded-lg overflow-x-auto mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-github-border text-github-text">
              <th className="p-4 font-semibold text-sm w-1/4">Project Name</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm w-1/3">Features (AI)</th>
              <th className="p-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.added.map(proj => (
              <tr key={proj._id} className="border-t border-github-border hover:bg-github-bg transition-colors">
                <td className="p-4">
                  <div className="font-semibold">{proj.name}</div>
                  <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-github-accent text-xs">View Code</a>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${proj.status === 'approved' ? 'bg-green-900 text-green-300' : proj.status === 'rejected' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {proj.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {proj.features?.slice(0, 2).join(', ')}{proj.features?.length > 2 ? '...' : ''}
                </td>
                <td className="p-4 flex flex-wrap gap-2">
                  {proj.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(proj._id, 'approve')} className="p-1.5 bg-green-600 rounded text-white hover:bg-green-500 transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => handleAction(proj._id, 'reject')} className="p-1.5 bg-yellow-600 rounded text-white hover:bg-yellow-500 transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
                    </>
                  )}
                  <button onClick={() => handleEditClick(proj)} className="p-1.5 bg-github-accent rounded text-white hover:opacity-90 transition-opacity" title="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleAction(proj._id, 'delete')} className="p-1.5 bg-red-600 rounded text-white hover:bg-red-500 transition-colors" title="Delete from Portfolio"><Trash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {data.added.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">No projects in portfolio. Add one from below!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-300">Not Added to Portfolio (GitHub Sync)</h2>
      <div className="bg-github-card border border-github-border rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-github-border text-github-text">
              <th className="p-4 font-semibold text-sm w-1/4">Repository</th>
              <th className="p-4 font-semibold text-sm w-1/2">Description</th>
              <th className="p-4 font-semibold text-sm">Language</th>
              <th className="p-4 font-semibold text-sm text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.notAdded.map(repo => (
              <tr key={repo.github_url} className="border-t border-github-border hover:bg-github-bg transition-colors">
                <td className="p-4">
                  <div className="font-semibold">{repo.name}</div>
                  <a href={repo.github_url} target="_blank" rel="noreferrer" className="text-github-accent text-xs">View Code</a>
                </td>
                <td className="p-4 text-sm text-gray-400 truncate max-w-xs" title={repo.description}>
                  {repo.description || 'No description found on GitHub'}
                </td>
                <td className="p-4">
                  <span className="text-xs text-gray-500 font-mono">{repo.language || 'N/A'}</span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleImport(repo.owner, repo.name)}
                    disabled={importing === repo.name}
                    className="px-3 py-1.5 bg-github-accent rounded text-white hover:opacity-90 transition-opacity text-sm flex items-center gap-2 ml-auto disabled:opacity-50"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    {importing === repo.name ? 'Importing...' : 'Add to Portfolio'}
                  </button>
                </td>
              </tr>
            ))}
            {data.notAdded.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">All your public repositories are already in your portfolio!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-github-card border border-github-border rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">Name</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#0d1117] border border-github-border p-2 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">Description</label>
                <textarea rows="3" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#0d1117] border border-github-border p-2 rounded text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">Live URL (optional)</label>
                <input type="text" value={editForm.live_url} onChange={e => setEditForm({...editForm, live_url: e.target.value})} className="w-full bg-[#0d1117] border border-github-border p-2 rounded text-white placeholder-gray-600" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">Features (comma separated)</label>
                <input type="text" value={editForm.features} onChange={e => setEditForm({...editForm, features: e.target.value})} className="w-full bg-[#0d1117] border border-github-border p-2 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">Tech Stack (comma separated)</label>
                <input type="text" value={editForm.tech_stack} onChange={e => setEditForm({...editForm, tech_stack: e.target.value})} className="w-full bg-[#0d1117] border border-github-border p-2 rounded text-white" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 border border-github-border rounded hover:bg-gray-800 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-github-accent text-white rounded hover:opacity-90 transition disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
