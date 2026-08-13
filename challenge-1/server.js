require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// Routes

app.use("/auth", authRoutes);

app.use("/products", productRoutes);


// Health check

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Product Inventory API is running"
  });
});


// Error handler

app.use(errorHandler);


// Database

connectDB();


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});