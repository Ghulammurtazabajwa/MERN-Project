import React, { useState } from "react";
import { Link, NavLink } from "react-router";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <Link className="navbar-logo" to="/">
        MERN Stack App
      </Link>
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>
      <form className="search-box">
        <input className="search-input" type="text" placeholder="Search..." />
        <button className="search-btn" type="submit">Search</button>
      </form>
      <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
        {!localStorage.getItem("accessToken") ? (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/register" onClick={closeMenu}>
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" onClick={closeMenu}>
              Profile
            </NavLink>
            <NavLink to="/logout" onClick={closeMenu}>
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};
