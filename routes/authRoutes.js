const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireGuest } = require('../middleware/auth');

const router = express.Router();

// Routes cho khách (yêu cầu người dùng CHƯA đăng nhập)
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);

// Routes được bảo vệ (yêu cầu người dùng đã đăng nhập)
router.get('/dashboard', requireAuth, authController.showDashboard);
router.get('/profile', requireAuth, authController.showProfile);
router.post('/profile', requireAuth, authController.updateProfile);
router.get('/change-password', requireAuth, authController.showChangePassword);
router.post('/change-password', requireAuth, authController.changePassword);
router.post('/logout', requireAuth, authController.logout);
router.get('/logout', requireAuth, authController.logout); // Cho phép GET để tiện lợi

module.exports = router;
