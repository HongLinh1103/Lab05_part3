# Hệ thống Quản lý Sản phẩm & Nhà cung cấp

Một ứng dụng web để quản lý sản phẩm và nhà cung cấp với đầy đủ chức năng CRUD, xác thực người dùng và bảo mật phiên làm việc.

## Features

- **Quản lý sản phẩm**: Thêm, sửa, xóa và xem danh sách sản phẩm
- **Quản lý nhà cung cấp**: Thêm, sửa, xóa và xem danh sách nhà cung cấp
- **Tìm kiếm & Lọc**: Tìm sản phẩm theo tên, lọc theo nhà cung cấp
- **Xác thực người dùng**: Đăng ký, đăng nhập, đăng xuất
- **Bảo mật**: Tất cả các chức năng CRUD yêu cầu đăng nhập
- **Quên mật khẩu**: Đặt lại mật khẩu qua email

## Công nghệ

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS
- **UI Framework**: Bootstrap 5
- **Authentication**: bcryptjs, express-session
- **Email**: nodemailer

## Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd node-mvc-crud-product-supplier-system
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Tạo file .env**

```env
MONGO_URI=mongodb://localhost:27017/product_supplier_db
SESSION_SECRET=your-secret-key
```

4. **Seed sample data**

```bash
npm run seed
```

5. **Khởi động ứng dụng**

```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Demo Account

- **Username**: linh
- **Password**: 12345678
- **Email**: test@example.com

## Cấu trúc thư mục

```
├── app.js              # Main application entry point
├── package.json        # Project dependencies and scripts
├── seed.js             # Sample data seeding script
├── .env                # Environment variables
├── config/             # Configuration files
├── controllers/        # Route handlers (controllers)
├── middleware/         # Custom middleware functions
├── models/             # Mongoose data models
├── routes/             # Express route definitions
├── views/              # EJS template files
└── public/             # Static assets (CSS, JS, images)
```

## API Routes

### Xác thực

- `GET /auth/login` - Login page
- `POST /auth/login` - Handle login
- `GET /auth/register` - Register page
- `POST /auth/register` - Handle registration
- `GET /auth/logout` - Logout

### Sản phẩm (Yêu cầu đăng nhập)

- `GET /products` - Product list
- `GET /products/new` - Create product form
- `POST /products` - Create new product
- `GET /products/:id/edit` - Edit product form
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Nhà cung cấp (Yêu cầu đăng nhập)

- `GET /suppliers` - Supplier list
- `GET /suppliers/new` - Create supplier form
- `POST /suppliers` - Create new supplier
- `GET /suppliers/:id/edit` - Edit supplier form
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

