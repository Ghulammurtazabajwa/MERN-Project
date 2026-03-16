import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use AuthContext login()
      await login(email.trim(), password);

      toast.success("Login successful!");
      setFormData({ email: "", password: "" });
      navigate("/profile"); // redirect after login
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Login</h2>
          <p className="subtitle">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-main">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
        <div className="divider">OR</div>
        {/* Google Login Button */}
        <GoogleLoginButton />
        <div className="form-footer">
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
