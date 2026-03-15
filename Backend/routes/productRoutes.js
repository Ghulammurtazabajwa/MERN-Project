import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getProducts);               // GET /api/products - all products
router.get("/:slug", getProductBySlug);    // GET /api/products/:slug - single product by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", authenticateAdmin, createProduct);         // POST /api/products - create new product
router.put("/:id", authenticateAdmin, updateProduct);      // PUT /api/products/:id - update product
router.delete("/:id", authenticateAdmin, deleteProduct);   // DELETE /api/products/:id - delete product

export default router;