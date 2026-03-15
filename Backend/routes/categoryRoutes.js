import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getCategories);             // GET /api/categories - all categories
router.get("/:slug", getCategoryBySlug);  // GET /api/categories/:slug - single category by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", authenticateAdmin, createCategory);          // POST /api/categories - create new category
router.put("/:id", authenticateAdmin, updateCategory);        // PUT /api/categories/:id - update category
router.delete("/:id", authenticateAdmin, deleteCategory);     // DELETE /api/categories/:id - delete category

export default router;