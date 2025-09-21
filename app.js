require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

// Import routes
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const { addUserToViews, logSessionActivity } = require('./middleware/auth');

// Tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Kết nối MongoDB thành công');
})
.catch((error) => {
  console.error('❌ Lỗi kết nối MongoDB:', error);
  process.exit(1);
});

// Thiết lập view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// Middleware session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Đặt true khi production với HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 giờ
  }
}));

// Middleware flash
app.use(flash());

// Middleware xác thực - thêm dữ liệu user vào views
app.use(addUserToViews);

// Ghi log hoạt động session (chỉ development)
app.use(logSessionActivity);

// Middleware toàn cục để truyền flash messages tới tất cả views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.get('/', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Supplier = require('./models/Supplier');
    
    const { search, supplier } = req.query;
    let query = {};
    
    // Xây dựng query tìm kiếm
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (supplier) {
      query.supplierId = supplier;
    }
    
    const products = await Product.find(query).populate('supplierId', 'name').sort({ name: 1 }).limit(6);
    const suppliers = await Supplier.find().sort({ name: 1 });
    
    res.render('index', {
      title: 'Quản Lý Sản Phẩm & Nhà Cung Cấp - Trang Chủ',
      products,
      suppliers,
      searchTerm: search || '',
      selectedSupplier: supplier || '',
      messages: req.flash()
    });
  } catch (error) {
    console.error('Lỗi tải trang chủ:', error);
    res.render('index', {
      title: 'Quản Lý Sản Phẩm & Nhà Cung Cấp - Trang Chủ',
      products: [],
      suppliers: [],
      searchTerm: '',
      selectedSupplier: '',
      messages: req.flash()
    });
  }
});

// Chuyển hướng dashboard tới auth dashboard
app.get('/dashboard', (req, res) => {
  res.redirect('/auth/dashboard');
});

// Routes xác thực
app.use('/auth', authRoutes);

// Routes được bảo vệ
app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);
app.use('/session', sessionRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Không Tìm Thấy Trang',
    messages: req.flash(),
    url: req.originalUrl
  });
});

// Xử lý lỗi
app.use((error, req, res, next) => {
  console.error('Lỗi:', error);
  
  // Lỗi validation của Mongoose
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    req.flash('error', messages.join(', '));
    return res.redirect('back');
  }
  
  // Lỗi CastError của Mongoose (ObjectId không hợp lệ)
  if (error.name === 'CastError') {
    req.flash('error', 'ID không hợp lệ');
    return res.redirect('/');
  }
  
  // Lỗi mặc định
  res.status(500).render('500', {
    title: 'Lỗi Server',
    messages: req.flash(),
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Tắt ứng dụng một cách nhẹ nhàng
process.on('SIGINT', async () => {
  console.log('\n⏹️  Đang tắt ứng dụng...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ Đã đóng kết nối MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tắt ứng dụng:', error);
    process.exit(1);
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Môi trường: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/product_supplier_db'}`);
});

module.exports = app;
