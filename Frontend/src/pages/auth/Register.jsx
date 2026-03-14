import React from 'react';
import { Link } from 'react-router';

export const Register = () => {
  return (
    <div className="form">
      <h1>Register</h1>
      <p>Registration form goes here.</p>
      <form>
        <label>Username:</label>
        <input type="text" name="username" />
        <br />
        <label>Email:</label>
        <input type="email" name="email" />
        <br />
        <label>Address:</label>
        <input type="text" name="address" />
        <br />
        <label>Phone Number:</label>
        <input type="tel" name="phone" />
        <br />
        <label>Password:</label>
        <input type="password" name="password" />
        <br />
        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" />
        <br />
        <button type="submit">Register</button>
      </form>
        <p>Already have an account? <Link to="/login">Login here.</Link></p>
    </div>
  );
};
