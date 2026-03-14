import React from 'react';
import { Link } from 'react-router';

export const Login = () => {
  return (
    <div className="form">
      <h1>Login</h1>
      <p>Welcome to the login page!</p>
      <form>
        <label>Email:</label>
        <input type="email" name="email" />
        <br />
        <label>Password:</label>
        <input type="password" name="password" />
        <br />
        <button type="submit">Login</button>
      </form>
      <button className='social-login'>Login with Google</button>
      <button className='social-login'>Login with Facebook</button>
      <p>
        Don't have an account? <Link to="/register">Register here.</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset it here.</Link>
      </p>
    </div>
  );
};
