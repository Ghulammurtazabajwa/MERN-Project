import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
  logoutController,
  googleAuthController,
} from "../controllers/authController.js";

const router = express.Router();

// Auth
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

// Google OAuth
router.post("/google-login", googleAuthController);

export default router;