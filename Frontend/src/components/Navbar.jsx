export const Navbar = () => {
  return (
    <nav className="navbar">
        <h1 className="navbar-logo">MERN Stack App</h1>
        <ul className="navbar-links">
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
        </ul>
    </nav>
  )
}