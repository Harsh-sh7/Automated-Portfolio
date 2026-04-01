import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
  if (adminInfo && adminInfo.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return config;
});

export const loginAdmin = async (email, password) => {
  const { data } = await api.post('/admin/login', { email, password });
  return data;
};

export const getApprovedProjects = async () => {
  const { data } = await api.get('/projects');
  return data;
};

export const getAllProjects = async () => {
  const { data } = await api.get('/projects/admin/all');
  return data;
};

export const getDashboardData = async () => {
  const { data } = await api.get('/projects/admin/dashboard-data');
  return data;
};

export const importGithubProject = async (owner, repo) => {
  const { data } = await api.post('/projects/admin/import', { owner, repo });
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const approveProject = async (id) => {
  // Wait, if it's protected from admin side, use the token
  const { data } = await api.get(`/projects/approve/${id}`);
  return data;
};

export const rejectProject = async (id) => {
  const { data } = await api.get(`/projects/reject/${id}`);
  return data;
};

export default api;
