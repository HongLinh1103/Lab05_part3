const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { requireAuth } = require('../middleware/auth');

// GET /suppliers - Hiển thị danh sách tất cả nhà cung cấp (yêu cầu đăng nhập)
router.get('/', requireAuth, supplierController.index);

// GET /suppliers/new - Hiển thị form tạo nhà cung cấp mới (yêu cầu đăng nhập)
router.get('/new', requireAuth, supplierController.new);

// POST /suppliers - Tạo nhà cung cấp mới (yêu cầu đăng nhập)
router.post('/', requireAuth, supplierController.create);

// GET /suppliers/:id - Hiển thị chi tiết nhà cung cấp (yêu cầu đăng nhập)
router.get('/:id', requireAuth, supplierController.show);

// GET /suppliers/:id/edit - Hiển thị form chỉnh sửa nhà cung cấp (yêu cầu đăng nhập)
router.get('/:id/edit', requireAuth, supplierController.edit);

// PUT /suppliers/:id - Cập nhật nhà cung cấp (yêu cầu đăng nhập)
router.put('/:id', requireAuth, supplierController.update);

// DELETE /suppliers/:id - Xóa nhà cung cấp (yêu cầu đăng nhập)
router.delete('/:id', requireAuth, supplierController.delete);

module.exports = router;
