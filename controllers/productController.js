const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// GET /products - Display all products with search and filter
exports.index = async (req, res) => {
  try {
    const { search, supplier } = req.query;
    let query = {};
    
    // Build search query
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (supplier) {
      query.supplierId = supplier;
    }
    
    const products = await Product.find(query).populate('supplierId', 'name').sort({ name: 1 });
    const suppliers = await Supplier.find().sort({ name: 1 });
    
    res.render('products/index', {
      title: 'Products List',
      products,
      suppliers,
      searchTerm: search || '',
      selectedSupplier: supplier || '',
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    req.flash('error', 'Error loading products');
    res.redirect('/');
  }
};

// GET /products/new - Show form to create new product
exports.new = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('products/new', {
      title: 'Add New Product',
      suppliers,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching suppliers for new product:', error);
    req.flash('error', 'Error loading suppliers');
    res.redirect('/products');
  }
};

// POST /products - Create new product
exports.create = async (req, res) => {
  try {
    const { name, price, quantity, supplierId } = req.body;
    
    // Basic validation
    if (!name || !price || !quantity || !supplierId) {
      req.flash('error', 'All fields are required');
      return res.redirect('/products/new');
    }

    // Validate supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      req.flash('error', 'Selected supplier does not exist');
      return res.redirect('/products/new');
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      supplierId
    });
    
    await product.save();
    req.flash('success', 'Product created successfully');
    res.redirect('/products');
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash('error', messages.join(', '));
    } else {
      req.flash('error', 'Error creating product');
    }
    res.redirect('/products/new');
  }
};

// GET /products/:id - Show specific product
exports.show = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId');
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    
    res.render('products/show', {
      title: `Product: ${product.name}`,
      product,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    req.flash('error', 'Error loading product');
    res.redirect('/products');
  }
};

// GET /products/:id/edit - Show form to edit product
exports.edit = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId');
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    
    const suppliers = await Supplier.find().sort({ name: 1 });
    
    res.render('products/edit', {
      title: `Edit Product: ${product.name}`,
      product,
      suppliers,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    req.flash('error', 'Error loading product');
    res.redirect('/products');
  }
};

// PUT /products/:id - Update product
exports.update = async (req, res) => {
  try {
    const { name, price, quantity, supplierId } = req.body;
    
    // Basic validation
    if (!name || !price || !quantity || !supplierId) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/products/${req.params.id}/edit`);
    }

    // Validate supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      req.flash('error', 'Selected supplier does not exist');
      return res.redirect(`/products/${req.params.id}/edit`);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        supplierId
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    
    req.flash('success', 'Product updated successfully');
    res.redirect('/products');
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash('error', messages.join(', '));
    } else {
      req.flash('error', 'Error updating product');
    }
    res.redirect(`/products/${req.params.id}/edit`);
  }
};

// DELETE /products/:id - Delete product
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    
    req.flash('success', 'Product deleted successfully');
    res.redirect('/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    req.flash('error', 'Error deleting product');
    res.redirect('/products');
  }
};
