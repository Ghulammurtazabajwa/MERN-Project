import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authorizeAdmin, authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getProducts);               // GET /api/products - all products
router.get("/:slug", getProductBySlug);    // GET /api/products/:slug - single product by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", authenticateUser, authorizeAdmin, createProduct);         // POST /api/products - create new product
router.put("/:id", authenticateUser, authorizeAdmin, updateProduct);      // PUT /api/products/:id - update product
router.delete("/:id", authenticateUser, authorizeAdmin, deleteProduct);   // DELETE /api/products/:id - delete product

export default router;