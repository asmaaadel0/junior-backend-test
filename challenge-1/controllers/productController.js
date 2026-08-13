const Product = require("../models/Product");

// POST /products
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, quantity } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      quantity
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};


// GET /products
const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = 10;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Product.countDocuments()
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};


// GET /products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    next(error);
  }
};


// PUT /products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    next(error);
  }
};


// DELETE /products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};