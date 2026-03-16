import mongoose from "mongoose";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => !v || validator.isMobilePhone(v + "", "any"),
        message: "Invalid phone number",
      },
    },
    address: String,
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Google users do not need password
      },
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    googleId: { type: String, default: null },
    facebookId: String,
    provider: { type: String, enum: ["local", "google", "facebook"], default: "local", },
    avatar: String,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
      },
    },
  }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await argon2.hash(this.password);
});

// Compare password
userSchema.methods.comparePassword = async function (plain) {
  return await argon2.verify(this.password, plain);
};

// Generate tokens
userSchema.methods.generateTokens = function () {
  const accessToken = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m" }
  );
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );
  return { accessToken, refreshToken };
};

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default model("User", userSchema);
