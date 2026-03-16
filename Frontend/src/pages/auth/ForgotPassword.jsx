import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());

      if (res.success || res?.message) {
        toast.success(res.message || "Reset link sent to your email");
        setEmail("");
      } else {
        toast.error(res.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err?.response?.data?.message || "Error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Forgot Password</h2>
          <p className="subtitle">Enter your email to get a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="form-main">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
