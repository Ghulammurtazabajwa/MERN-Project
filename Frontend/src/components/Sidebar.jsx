import { NavLink } from "react-router";

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/create-post" className="sidebar-link">
          <i className="fas fa-plus"></i>
          <span>Create Post</span>
        </NavLink>
        <NavLink to="/posts" className="sidebar-link">
          <i className="fas fa-file-alt"></i>
          <span>Posts</span>
        </NavLink>
        <NavLink to="/blog" className="sidebar-link">
          <i className="fas fa-blog"></i>
          <span>Blog</span>
        </NavLink>
        <NavLink to="/users" className="sidebar-link">
          <i className="fas fa-users"></i>
          <span>Users</span>
        </NavLink>
        <NavLink to="/products" className="sidebar-link">
          <i className="fas fa-box"></i>
          <span>Products</span>
        </NavLink>
        <NavLink to="/categories" className="sidebar-link">
          <i className="fas fa-folder"></i>
          <span>Categories</span>
        </NavLink>
        <NavLink to="/comments" className="sidebar-link">
          <i className="fas fa-envelope"></i>
          <span>Comments</span>
        </NavLink>
        <NavLink to="/services" className="sidebar-link">
          <i className="fas fa-cogs"></i>
          <span>Services</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};
