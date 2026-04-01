import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Portfolio from './pages/Portfolio';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#161b22', color: '#c9d1d9', border: '1px solid #30363d' } }} />
      <div className="min-h-screen bg-github-bg text-github-text font-sans">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
