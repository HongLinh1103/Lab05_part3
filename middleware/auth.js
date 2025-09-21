// Middleware xác thực

// Middleware yêu cầu đăng nhập
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    // Lưu URL gốc để chuyển hướng sau khi đăng nhập
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Vui lòng đăng nhập để truy cập trang này');
    return res.redirect('/auth/login');
  }
};

// Middleware yêu cầu khách (chưa đăng nhập)
const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  } else {
    return next();
  }
};

// Middleware yêu cầu quyền admin
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    req.flash('error', 'Truy cập bị từ chối. Cần quyền quản trị viên.');
    return res.redirect('/dashboard');
  }
};

// Middleware làm cho dữ liệu người dùng có sẵn trong tất cả views
const addUserToViews = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!(req.session && req.session.user);
  next();
};

// Middleware ghi log hoạt động session (để debug)
const logSessionActivity = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Hoạt động Session:', {
      sessionId: req.sessionID,
      user: req.session.user ? req.session.user.username : 'Khách',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest,
  requireAdmin,
  addUserToViews,
  logSessionActivity
};
