const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự']
  },
  price: {
    type: Number,
    required: [true, 'Giá sản phẩm là bắt buộc'],
    min: [0, 'Giá không thể âm']
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng sản phẩm là bắt buộc'],
    min: [0, 'Số lượng không thể âm'],
    default: 0
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'ID nhà cung cấp là bắt buộc']
  }
}, {
  timestamps: true
});

// Index để cải thiện hiệu suất truy vấn
productSchema.index({ supplierId: 1 });
productSchema.index({ name: 1 });

// Virtual để populate thông tin nhà cung cấp
productSchema.virtual('supplier', {
  ref: 'Supplier',
  localField: 'supplierId',
  foreignField: '_id',
  justOne: true
});

// Đảm bảo virtual fields được serialize
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
