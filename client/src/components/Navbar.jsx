import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ isLoggedIn, onLogout }) {
  // Check if user is admin
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const user = getUserData();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-brand">
        <h2>Mosaic Connect</h2>
      </div>

      {/* Right: Navigation links */}
      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <NavLink to="/events" className="nav-link">Event</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>
        <NavLink to="/chat" className="nav-link">Chat</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink> 

        {/* Admin Panel Link - Only show for admin users */}
        {isLoggedIn && isAdmin && (
          <NavLink to="/admin/users" className="nav-link admin-link" title="Admin Panel">
            <i className="bi bi-shield-check"></i>
            <span className="admin-text">Admin</span>
          </NavLink>
        )}

        {/* Settings Icon */}
        <button className="settings-btn">
          <i className="bi bi-gear"></i>
        </button>

        {/* Login / Logout */}
        {!isLoggedIn ? (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        ) : (
          <button className="nav-link logout-link" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
