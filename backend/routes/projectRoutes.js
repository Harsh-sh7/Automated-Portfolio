const express = require('express');
const router = express.Router();
const {
  getProjects,
  getAllProjects,
  updateProject,
  deleteProject,
  approveProject,
  rejectProject,
  getDashboardData,
  importProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProjects);

// Action links (these are via email initially, so GET, but should ideally be authenticated or tokenized)
router.get('/approve/:id', approveProject);
router.get('/reject/:id', rejectProject);

// Private Admin routes
router.get('/admin/dashboard-data', protect, getDashboardData);
router.post('/admin/import', protect, importProject);
router.get('/admin/all', protect, getAllProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
