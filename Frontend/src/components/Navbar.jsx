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

      <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <form className="navbar-search">
          <input type="text" placeholder="Search..." />
          <button type="submit">Search</button>
        </form>

        {!localStorage.getItem("accessToken") ? (
          <>
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
            <NavLink to="/logout" onClick={closeMenu}>Logout</NavLink>
          </>
        )}

      </nav>
    </header>
  );
};
