import { React } from "react";
import { Link } from "react-router";

export const ForgotPassword = () => {
  return (
    <div className="form">
      <h1>Forgot Password</h1>
      <p>Enter your email to reset your password.</p>
      <form>
        <label>Email:</label>
        <input type="email" name="email" />
        <br />
        <button type="submit">Reset Password</button>
      </form>
        <p>Remembered your password? <Link to="/login">Login here.</Link></p>
    </div>
  );
};
