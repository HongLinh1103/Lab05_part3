const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

// GET /products - Hiển thị danh sách tất cả sản phẩm (yêu cầu đăng nhập)
router.get('/', requireAuth, productController.index);

// GET /products/new - Hiển thị form tạo sản phẩm mới (yêu cầu đăng nhập)
router.get('/new', requireAuth, productController.new);

// POST /products - Tạo sản phẩm mới (yêu cầu đăng nhập)
router.post('/', requireAuth, productController.create);

// GET /products/:id - Hiển thị chi tiết sản phẩm (yêu cầu đăng nhập)
router.get('/:id', requireAuth, productController.show);

// GET /products/:id/edit - Hiển thị form chỉnh sửa sản phẩm (yêu cầu đăng nhập)
router.get('/:id/edit', requireAuth, productController.edit);

// PUT /products/:id - Cập nhật sản phẩm (yêu cầu đăng nhập)
router.put('/:id', requireAuth, productController.update);

// DELETE /products/:id - Xóa sản phẩm (yêu cầu đăng nhập)
router.delete('/:id', requireAuth, productController.delete);

module.exports = router;
