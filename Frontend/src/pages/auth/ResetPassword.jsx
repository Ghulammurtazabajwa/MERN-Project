import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useAuth(); // use AuthContext resetPassword
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password.trim());

      if (res.success || res?.message) {
        toast.success(res.message || "Password reset successful!");
        setPassword("");
        navigate("/login");
      } else {
        toast.error(res.message || "Reset failed");
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="form-main">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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
