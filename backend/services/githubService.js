const axios = require('axios');

const getRepoDetails = async (owner, repo) => {
  try {
    const config = process.env.GITHUB_TOKEN ? { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } } : {};
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching repo details:', error.message);
    return null;
  }
};

const getReadme = async (owner, repo) => {
  try {
    const config = process.env.GITHUB_TOKEN ? { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } } : {};
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, config);
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error fetching README:', error.message);
    return null;
  }
};

const getUserRepos = async () => {
  try {
    const config = process.env.GITHUB_TOKEN ? { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } } : {};
    const url = process.env.GITHUB_USERNAME 
      ? `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?per_page=100&sort=updated` 
      : `https://api.github.com/user/repos?per_page=100&sort=updated`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user repos:', error.message);
    return [];
  }
};

module.exports = { getRepoDetails, getReadme, getUserRepos };
