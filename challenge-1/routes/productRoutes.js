const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  authenticate,
  authorizeAdmin
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const productValidation = require("../validators/productValidator");


// Public routes

router.get("/", getProducts);

router.get("/:id", getProductById);


// Admin routes

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  productValidation,
  validate,
  createProduct
);


router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  productValidation,
  validate,
  updateProduct
);


router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteProduct
);


module.exports = router;