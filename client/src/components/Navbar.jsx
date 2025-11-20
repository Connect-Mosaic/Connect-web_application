import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-brand">
        <h2>Mosaic Connect</h2>
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search for friends or events..." 
          className="search-input"
        />
      </div>

      {/* Right: Navigation links */}
      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <NavLink to="/events" className="nav-link">Event</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>
        <NavLink to="/chat" className="nav-link">Chat</NavLink>

        {/* Settings Icon */}
        <button className="settings-btn">
          <i className="bi bi-gear"></i>
        </button>

        {/* Login / Logout — same style as nav links */}
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
