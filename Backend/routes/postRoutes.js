import express from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public Routes
router.get("/", getPosts);             // GET /api/posts - all posts with filters
router.get("/:slug", getPostBySlug);  // GET /api/posts/:slug - single post by slug

// 🟢 Protected / Admin Routes (Add auth middleware if needed)
router.post("/", authenticateAdmin, createPost);          // POST /api/posts - create new post
router.put("/:id", authenticateAdmin, updatePost);        // PUT /api/posts/:id - update post
router.delete("/:id", authenticateAdmin, deletePost);     // DELETE /api/posts/:id - delete post

export default router;
