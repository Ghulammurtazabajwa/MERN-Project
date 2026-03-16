import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authorizeAdmin, authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getCategories);             // GET /api/categories - all categories
router.get("/:slug", getCategoryBySlug);  // GET /api/categories/:slug - single category by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", authenticateUser, authorizeAdmin, createCategory);          // POST /api/categories - create new category
router.put("/:id", authenticateUser, authorizeAdmin, updateCategory);        // PUT /api/categories/:id - update category
router.delete("/:id", authenticateUser, authorizeAdmin, deleteCategory);     // DELETE /api/categories/:id - delete category

export default router;