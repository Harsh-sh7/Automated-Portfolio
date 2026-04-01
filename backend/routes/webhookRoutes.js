const express = require('express');
const router = express.Router();
const { handleGithubWebhook } = require('../controllers/webhookController');

router.post('/github', handleGithubWebhook);

module.exports = router;
