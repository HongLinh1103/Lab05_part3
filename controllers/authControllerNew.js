const User = require('../models/User');

module.exports = {
  showRegister: (req, res) => {
    res.render('auth/register', {
      title: 'Đăng Ký',
      error: req.flash('error'),
      success: req.flash('success'),
      oldInput: req.flash('oldInput')[0] || {}
    });
  },

  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword, fullName, phone } = req.body;

      if (!username || !email || !password || !confirmPassword || !fullName || !phone) {
        req.flash('error', 'Tất cả các trường đều bắt buộc');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Mật khẩu xác nhận không khớp');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      if (password.length < 6) {
        req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        req.flash('error', 'Tên đăng nhập hoặc email đã tồn tại');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/register');
      }

      const newUser = new User({
        username,
        email,
        password,
        fullName,
        phone,
        role: 'user'
      });

      await newUser.save();

      req.flash('success', 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      res.redirect('/auth/login');

    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      req.flash('error', 'Có lỗi xảy ra trong quá trình đăng ký');
      req.flash('oldInput', req.body);
      res.redirect('/auth/register');
    }
  },

  showLogin: (req, res) => {
    res.render('auth/login', {
      title: 'Đăng Nhập',
      error: req.flash('error'),
      success: req.flash('success'),
      oldInput: req.flash('oldInput')[0] || {}
    });
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.flash('error', 'Tên đăng nhập và mật khẩu đều bắt buộc');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/login');
      }

      const user = await User.findOne({
        $or: [{ username }, { email: username }]
      });

      if (!user) {
        req.flash('error', 'Thông tin đăng nhập không chính xác');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/login');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        req.flash('error', 'Thông tin đăng nhập không chính xác');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/login');
      }

      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };

      const returnTo = req.session.returnTo || '/auth/dashboard';
      delete req.session.returnTo;
      
      req.flash('success', `Chào mừng ${user.fullName || user.username}!`);
      res.redirect(returnTo);

    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      req.flash('error', 'Có lỗi xảy ra trong quá trình đăng nhập');
      req.flash('oldInput', req.body);
      res.redirect('/auth/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Lỗi đăng xuất:', err);
        req.flash('error', 'Có lỗi xảy ra khi đăng xuất');
        return res.redirect('/');
      }
      
      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  },

  showDashboard: async (req, res) => {
    try {
      const Product = require('../models/Product');
      const Supplier = require('../models/Supplier');
      
      const totalProducts = await Product.countDocuments();
      const totalSuppliers = await Supplier.countDocuments();
      const recentProducts = await Product.find()
        .populate('supplierId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.render('auth/dashboard', {
        title: 'Bảng Điều Khiển',
        totalProducts,
        totalSuppliers,
        recentProducts,
        error: req.flash('error'),
        success: req.flash('success')
      });
    } catch (error) {
      console.error('Lỗi dashboard:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải dashboard');
      res.redirect('/');
    }
  },

  showProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id);
      
      res.render('auth/profile', {
        title: 'Hồ Sơ Cá Nhân',
        user,
        error: req.flash('error'),
        success: req.flash('success'),
        oldInput: req.flash('oldInput')[0] || {}
      });
    } catch (error) {
      console.error('Lỗi profile:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải hồ sơ');
      res.redirect('/auth/dashboard');
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { fullName, email, phone, currentPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findById(req.session.user._id);

      if (!fullName || !email || !phone) {
        req.flash('error', 'Họ tên, email và số điện thoại là bắt buộc');
        req.flash('oldInput', req.body);
        return res.redirect('/auth/profile');
      }

      user.fullName = fullName;
      user.email = email;
      user.phone = phone;

      if (newPassword) {
        if (!currentPassword) {
          req.flash('error', 'Vui lòng nhập mật khẩu hiện tại');
          req.flash('oldInput', req.body);
          return res.redirect('/auth/profile');
        }

        if (newPassword !== confirmPassword) {
          req.flash('error', 'Mật khẩu mới và xác nhận không khớp');
          req.flash('oldInput', req.body);
          return res.redirect('/auth/profile');
        }

        if (newPassword.length < 6) {
          req.flash('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
          req.flash('oldInput', req.body);
          return res.redirect('/auth/profile');
        }

        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
          req.flash('error', 'Mật khẩu hiện tại không chính xác');
          req.flash('oldInput', req.body);
          return res.redirect('/auth/profile');
        }

        user.password = newPassword;
      }

      await user.save();

      req.session.user.fullName = user.fullName;
      req.session.user.email = user.email;

      req.flash('success', 'Cập nhật hồ sơ thành công');
      res.redirect('/auth/profile');

    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      req.flash('error', 'Có lỗi xảy ra khi cập nhật hồ sơ');
      req.flash('oldInput', req.body);
      res.redirect('/auth/profile');
    }
  }
};
