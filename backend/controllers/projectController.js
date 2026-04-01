const Project = require('../models/Project');
const { getRepoDetails, getReadme, getUserRepos } = require('../services/githubService');
const { summarizeReadme } = require('../services/geminiService');

// @desc    Get all approved projects (public portfolio)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'approved' }).sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all projects (admin dashboard)
// @route   GET /api/projects/admin/all
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve project
// @route   GET /api/projects/approve/:id
// @access  Public (from email link) or Private
const approveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    
    project.status = 'approved';
    await project.save();
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.json({ message: 'Project approved' });
    } else {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/admin/dashboard`);
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Reject project
// @route   GET /api/projects/reject/:id
// @access  Public (from email link) or Private
const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    
    project.status = 'rejected';
    await project.save();
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.json({ message: 'Project rejected' });
    } else {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/admin/dashboard`);
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get dashboard data (Added and Not Added projects)
// @route   GET /api/projects/admin/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const dbProjects = await Project.find({}).sort({ created_at: -1 });
    const githubRepos = await getUserRepos();
    
    // Map github urls for quick lookup
    const dbUrls = dbProjects.map(p => p.github_url ? p.github_url.toLowerCase() : '');
    
    // Filter out repos that are already in the DB
    const notAdded = githubRepos.filter(repo => !dbUrls.includes(repo.html_url.toLowerCase()));
    
    res.json({
      added: dbProjects,
      notAdded: notAdded.map(r => ({
        name: r.name,
        github_url: r.html_url,
        description: r.description,
        language: r.language,
        owner: r.owner.login
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

// @desc    Import a project manually from GitHub
// @route   POST /api/projects/admin/import
// @access  Private
const importProject = async (req, res) => {
  const { owner, repo } = req.body;
  
  try {
    const repoDetails = await getRepoDetails(owner, repo);
    if (!repoDetails) return res.status(404).json({ message: 'GitHub repo not found' });
    
    const existing = await Project.findOne({ github_url: repoDetails.html_url });
    if (existing) return res.status(400).json({ message: 'Project already in portfolio' });

    let liveUrl = repoDetails.homepage || null;
    const readmeContent = await getReadme(owner, repo);
    
    if (!liveUrl && readmeContent) {
      const urlRegex = /(https?:\/\/[a-zA-Z0-9.\-]+\.(vercel\.app|netlify\.app|herokuapp\.com|onrender\.com)[a-zA-Z0-9./\-]*)/i;
      const match = readmeContent.match(urlRegex);
      if (match) liveUrl = match[1];
    }

    let aiSummary = {
      description: repoDetails.description || '',
      features: [],
      tech_stack: repoDetails.language ? [repoDetails.language] : []
    };

    if (readmeContent) {
      const summary = await summarizeReadme(readmeContent);
      if (summary) aiSummary = summary;
    }

    const newProject = await Project.create({
      name: repoDetails.name,
      github_url: repoDetails.html_url,
      live_url: liveUrl,
      description: aiSummary.description,
      features: aiSummary.features,
      tech_stack: aiSummary.tech_stack,
      status: 'approved',
      featured: false
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error while importing project' });
  }
};

module.exports = {
  getProjects,
  getAllProjects,
  updateProject,
  deleteProject,
  approveProject,
  rejectProject,
  getDashboardData,
  importProject
};
