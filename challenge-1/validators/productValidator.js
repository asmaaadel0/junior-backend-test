const { body } = require("express-validator");

const productValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string")
    .trim(),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
];

module.exports = productValidation;
