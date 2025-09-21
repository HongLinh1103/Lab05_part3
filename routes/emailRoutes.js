const express = require('express');
const { sendEmail } = require('../config/email');
const User = require('../models/User');

const router = express.Router();

// Demo email page - chỉ cho development
if (process.env.NODE_ENV !== 'production') {
  router.get('/demo-email', async (req, res) => {
    try {
      const user = await User.findOne({ email: 'test@example.com' });
      if (!user) {
        return res.json({ error: 'User not found' });
      }

      const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password/demo-token-123`;

      const result = await sendEmail(user.email, 'resetPassword', {
        resetUrl,
        user
      });

      res.json({
        message: 'Demo email sent',
        result,
        note: 'Check console for Ethereal Email preview link'
      });
    } catch (error) {
      res.json({ error: error.message });
    }
  });
}

module.exports = router;
