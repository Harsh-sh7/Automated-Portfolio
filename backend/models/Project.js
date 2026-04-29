const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  github_url: { type: String, required: true },
  live_url: { type: String, default: null },
  description: { type: String, default: '' },
  features: { type: [String], default: [] },
  tech_stack: { type: [String], default: [] },
  image_url: { type: String, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Project', projectSchema);
