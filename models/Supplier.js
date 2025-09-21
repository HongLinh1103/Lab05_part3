const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên nhà cung cấp là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên nhà cung cấp không được vượt quá 100 ký tự']
  },
  address: {
    type: String,
    required: [true, 'Địa chỉ nhà cung cấp là bắt buộc'],
    trim: true,
    maxlength: [200, 'Địa chỉ không được vượt quá 200 ký tự']
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [/^[\d\-\+\(\)\s]+$/, 'Vui lòng nhập số điện thoại hợp lệ']
  }
}, {
  timestamps: true
});

// Virtual để lấy sản phẩm của nhà cung cấp này
supplierSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplierId'
});

// Đảm bảo virtual fields được serialize
supplierSchema.set('toJSON', { virtuals: true });
supplierSchema.set('toObject', { virtuals: true });

// Pre-remove middleware để xử lý xóa liên tục
supplierSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const Product = require('./Product');
  await Product.deleteMany({ supplierId: this._id });
});

module.exports = mongoose.model('Supplier', supplierSchema);
