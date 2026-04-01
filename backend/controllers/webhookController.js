const crypto = require('crypto');
const Project = require('../models/Project');
const { getRepoDetails, getReadme } = require('../services/githubService');
const { summarizeReadme } = require('../services/geminiService');
const { sendApprovalEmail } = require('../services/emailService');

// @desc    Handle GitHub Webhook events
// @route   POST /api/webhook/github
// @access  Public
const handleGithubWebhook = async (req, res) => {
  const event = req.headers['x-github-event'];

  // We only care about repositories being created or pushed
  if (event === 'repository' || event === 'push') {
    const payload = req.body;
    
    // In 'repository' event, action is 'created'. In 'push', there is no action field but there's a repository object.
    const repo = payload.repository;
    if (!repo) return res.status(200).send('No repository data');

    const owner = repo.owner.login || repo.owner.name;
    const repoName = repo.name;
    
    // Check if project already exists
    const existing = await Project.findOne({ github_url: repo.html_url });
    if (existing) {
      console.log('Project already exists in portfolio.');
      return res.status(200).send('Already exists');
    }

    // Try extracting Live URL
    let liveUrl = repo.homepage || null;
    
    // Fetch detailed readme
    const readmeContent = await getReadme(owner, repoName);
    
    // Fallback live url extraction from README
    if (!liveUrl && readmeContent) {
      const urlRegex = /(https?:\/\/[a-zA-Z0-9.\-]+\.(vercel\.app|netlify\.app|herokuapp\.com|onrender\.com)[a-zA-Z0-9./\-]*)/i;
      const match = readmeContent.match(urlRegex);
      if (match) liveUrl = match[1];
    }

    // AI Summarization
    let aiSummary = {
      description: repo.description || '',
      features: [],
      tech_stack: []
    };

    if (readmeContent) {
      const summary = await summarizeReadme(readmeContent);
      if (summary) aiSummary = summary;
    }

    // Create 'pending' project in DB
    const newProject = await Project.create({
      name: repo.name,
      github_url: repo.html_url,
      live_url: liveUrl,
      description: aiSummary.description,
      features: aiSummary.features,
      tech_stack: aiSummary.tech_stack,
      status: 'pending',
      featured: false
    });

    // Send approval email
    await sendApprovalEmail(newProject);

    return res.status(200).send('Processed');
  }

  res.status(200).send('Ignored event');
};

module.exports = { handleGithubWebhook };
