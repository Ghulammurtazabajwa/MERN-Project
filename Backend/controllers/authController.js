import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/authValidation.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

// Register
export const registerController = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { username, email, phone, address, password } = parsed;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      username,
      email,
      phone,
      address,
      password,
      role: "user",
    });

    await user.save();

    const { accessToken, refreshToken } = user.generateTokens();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    const safeUser = user.toObject();
    delete safeUser.refreshToken;

    res.status(201).json({
      message: "User registered",
      accessToken,
      user: safeUser,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginController = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not Found" });

    if (!user.password)
      return res.status(400).json({ message: "Use Google login instead" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Password incorrect" });

    const { accessToken, refreshToken } = user.generateTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.json({ message: "Login successful", accessToken, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
export const forgotPasswordController = async (req, res) => {
  let parsed;
  try {
    parsed = forgotPasswordSchema.parse(req.body);
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.errors?.[0]?.message || "Invalid data" });
  }

  const { email } = parsed;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Reset link sent to your email (if account exists)",
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${
      process.env.CLIENT_URL
    }/reset-password/${encodeURIComponent(resetToken)}`;

    const recipientName = user.username || user.email;

    // HTML Template
    const html = `
      <div style="font-family: Arial, sans-serif; background:#0f1720;
      color:#e6eef8; padding:20px; border-radius:8px;">
        
        <h2 style="color:#1fb6ff">Password Reset Request</h2>

        <p>Hi ${recipientName},</p>

        <p>You requested to reset your password. Click the link below to reset it (valid for 15 minutes):</p>

        <p><a href="${resetLink}" style="color:#00d4ff">${resetLink}</a></p>

        <p>If you did not request this, you can safely ignore this email.</p>

        <hr />
        <small style="color:#9aa9bf">Sent from your app</small>
      </div>
    `;

    // Send Email (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Your App" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Password Reset Request",
          html,
        });
      } catch (mailErr) {
        console.error("❌ Error sending reset email:", mailErr);
      }
    } else {
      console.warn("⚠ Email credentials not configured. Reset email skipped.");
    }

    return res.json({
      message: "Reset link sent to your email (if account exists)",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset password
export const resetPasswordController = async (req, res) => {
  try {
    const rawToken = req.params.token;
    if (!rawToken) {
      return res.status(400).json({ message: "Reset token missing" });
    }

    let tokenUrl;
    try {
      tokenUrl = decodeURIComponent(rawToken);
    } catch (e) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    // Validate request body
    let parsed;
    try {
      parsed = resetPasswordSchema.parse(req.body);
    } catch (err) {
      return res
        .status(400)
        .json({ message: err.errors?.[0]?.message || "Invalid data" });
    }

    const { newPassword } = parsed;

    // Hash token to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenUrl)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Reset password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "✅ Password Updated Successfully",
          html: `
                <div style="font-family: Arial; background:#0f1720; color:#e6eef8; padding:20px; border-radius:10px;">
                  <h2 style="color:#1fb6ff;">Your Password Was Changed</h2>
                  <p>If you did NOT request this, please contact support immediately.</p>
                </div>
              `,
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }
    }

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Refresh token
export const refreshTokenController = async (req, res) => {
  const token =
    req.body?.refreshToken ||
    req.cookies?.refreshToken ||
    req.headers["x-refresh-token"];

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const { accessToken, refreshToken } = user.generateTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.json({ accessToken, refreshToken, user });
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Logout
export const logoutController = async (req, res) => {
  try {
    const token =
      req.body?.refreshToken ||
      req.cookies?.refreshToken ||
      req.headers["x-refresh-token"];
    if (!token) return res.status(400).json({ message: "No token" });

    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Google OAuth
export const googleAuthController = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: "Google token missing" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        avatar: picture,
        googleId: sub,
      });
    }

    const { accessToken, refreshToken } = user.generateTokens();
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.json({
      message: "Google Login Successful",
      accessToken,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};
