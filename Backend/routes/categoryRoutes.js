import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authorizeAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getCategories);             // GET /api/categories - all categories
router.get("/:slug", getCategoryBySlug);  // GET /api/categories/:slug - single category by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", protect, authorizeAdmin, createCategory);          // POST /api/categories - create new category
router.put("/:id", protect, authorizeAdmin, updateCategory);        // PUT /api/categories/:id - update category
router.delete("/:id", protect, authorizeAdmin, deleteCategory);     // DELETE /api/categories/:id - delete category

export default router;