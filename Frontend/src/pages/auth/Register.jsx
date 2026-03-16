import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth(); // get register and login from context
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { username, email, phone, address, password } = formData;

    // Basic validation
    if (!username || !email || !phone || !address || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ Call AuthContext register
      const res = await register({
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        password,
      });

      // Optionally login immediately after registration
      await login(email.trim(), password);

      toast.success(res?.message || "Registration successful!");

      // Reset fields
      setFormData({
        username: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });

      navigate("/profile");
    } catch (err) {
      console.error("Registration error:", err);
      // Axios error messages
      const message =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors)
          ? err.response.data.errors[0]?.msg
          : "Registration failed");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create Account</h2>
          <p className="subtitle">Join us today!</p>
        </div>

        <form onSubmit={handleSubmit} className="form-main">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              onChange={handleChange}
              autoComplete="tel-national"
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={handleChange}
              autoComplete="street-address"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Register…" : "Register"}
          </button>
        </form>
        <div className="divider">OR</div>
        {/* Google Login Button */}
        <GoogleLoginButton />
        <div className="form-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
