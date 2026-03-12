import User from "../models/User.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../utils/authSchema.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Cookie options for refresh token
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

// Register a new user
export const registerController = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { username, email, address, phone, password } = parsed;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create and save the new user
    const user = new User({ username, email, address, phone, password });
    const { accessToken, refreshToken } = user.generateTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in cookie and send response
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res
      .status(201)
      .json({ message: "User registered successfully", accessToken, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
export const loginController = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user has a password (not a Google account)
    if (!user.password) {
      return res.status(400).json({ message: "Please use Google login" });
    }

    // Compare provided password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate tokens and save refresh token
    const { accessToken, refreshToken } = user.generateTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in cookie and send response
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ message: "Login successful", accessToken, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
export const forgotPasswordController = async (req, res) => {
  try {
    const parsed = forgotPasswordSchema.parse(req.body);
    const { email } = parsed;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    await sendEmail(user.email, "Password Reset Request", message);
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
export const resetPasswordController = async (req, res) => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);
    const { password } = parsed;
    const { token } = req.params;

    // Find user by reset token and check if it's still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // If no user found, token is invalid or expired
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user's password and clear reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
    // Optionally, send email notification about password change
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const emailMessage = "Your password has been successfully reset.";
      await sendEmail(user.email, "Password Reset Successful", emailMessage);
    }
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Logout user
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token missing" });
    }
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// refreshToken
export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token missing" });
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken: newRefreshToken } =
      user.generateTokens();
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken, refreshToken: newRefreshToken, user });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Google OAuth
export const googleAuthController = async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username: name });
      const { accessToken, refreshToken } = user.generateTokens();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    } else if (!user.password) {
      const { accessToken, refreshToken } = user.generateTokens();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    } else {
      return res
        .status(400)
        .json({ message: "Please use email/password login" });
    }
    res.cookie("refreshToken", user.refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ message: "Login successful", accessToken, user });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
