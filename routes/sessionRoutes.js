const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /session/info - Get session information
router.get('/info', requireAuth, (req, res) => {
  res.json({
    sessionId: req.sessionID,
    user: req.session.user,
    cookie: req.session.cookie,
    timestamp: new Date().toISOString()
  });
});

// DELETE /session/clear - Clear session (logout)
router.delete('/clear', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to clear session',
        details: err.message
      });
    }
    
    res.json({
      message: 'Session cleared successfully',
      timestamp: new Date().toISOString()
    });
  });
});

module.exports = router;
