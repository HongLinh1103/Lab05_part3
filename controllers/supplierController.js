const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// GET /suppliers - Display all suppliers
exports.index = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.render('suppliers/index', {
      title: 'Suppliers List',
      suppliers,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    req.flash('error', 'Error loading suppliers');
    res.redirect('/');
  }
};

// GET /suppliers/new - Show form to create new supplier
exports.new = (req, res) => {
  res.render('suppliers/new', {
    title: 'Add New Supplier',
    messages: req.flash()
  });
};

// POST /suppliers - Create new supplier
exports.create = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    // Basic validation
    if (!name || !address || !phone) {
      req.flash('error', 'All fields are required');
      return res.redirect('/suppliers/new');
    }

    const supplier = new Supplier({ name, address, phone });
    await supplier.save();
    
    req.flash('success', 'Supplier created successfully');
    res.redirect('/suppliers');
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash('error', messages.join(', '));
    } else {
      req.flash('error', 'Error creating supplier');
    }
    res.redirect('/suppliers/new');
  }
};

// GET /suppliers/:id - Show specific supplier
exports.show = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      req.flash('error', 'Supplier not found');
      return res.redirect('/suppliers');
    }
    
    const products = await Product.find({ supplierId: supplier._id });
    
    res.render('suppliers/show', {
      title: `Supplier: ${supplier.name}`,
      supplier,
      products,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    req.flash('error', 'Error loading supplier');
    res.redirect('/suppliers');
  }
};

// GET /suppliers/:id/edit - Show form to edit supplier
exports.edit = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      req.flash('error', 'Supplier not found');
      return res.redirect('/suppliers');
    }
    
    res.render('suppliers/edit', {
      title: `Edit Supplier: ${supplier.name}`,
      supplier,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching supplier for edit:', error);
    req.flash('error', 'Error loading supplier');
    res.redirect('/suppliers');
  }
};

// PUT /suppliers/:id - Update supplier
exports.update = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    // Basic validation
    if (!name || !address || !phone) {
      req.flash('error', 'All fields are required');
      return res.redirect(`/suppliers/${req.params.id}/edit`);
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, address, phone },
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      req.flash('error', 'Supplier not found');
      return res.redirect('/suppliers');
    }
    
    req.flash('success', 'Supplier updated successfully');
    res.redirect('/suppliers');
  } catch (error) {
    console.error('Error updating supplier:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash('error', messages.join(', '));
    } else {
      req.flash('error', 'Error updating supplier');
    }
    res.redirect(`/suppliers/${req.params.id}/edit`);
  }
};

// DELETE /suppliers/:id - Delete supplier
exports.delete = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      req.flash('error', 'Supplier not found');
      return res.redirect('/suppliers');
    }
    
    // Check if supplier has products
    const productCount = await Product.countDocuments({ supplierId: supplier._id });
    if (productCount > 0) {
      req.flash('error', `Cannot delete supplier. ${productCount} product(s) are associated with this supplier.`);
      return res.redirect('/suppliers');
    }
    
    await Supplier.findByIdAndDelete(req.params.id);
    req.flash('success', 'Supplier deleted successfully');
    res.redirect('/suppliers');
  } catch (error) {
    console.error('Error deleting supplier:', error);
    req.flash('error', 'Error deleting supplier');
    res.redirect('/suppliers');
  }
};
