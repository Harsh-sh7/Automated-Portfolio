import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      toast.success('Logged in successfully');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-github-bg text-github-text">
      <form onSubmit={handleLogin} className="bg-github-card border border-github-border p-8 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-6">
          <div className="bg-github-border p-3 rounded-full">
            <Lock className="w-8 h-8 text-github-accent" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-github-bg border border-github-border rounded p-2 focus:outline-none focus:border-github-accent"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-github-bg border border-github-border rounded p-2 focus:outline-none focus:border-github-accent"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-github-accent text-white font-medium py-2 rounded focus:outline-none hover:opacity-90 transition-opacity"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
