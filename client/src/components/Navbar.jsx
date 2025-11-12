import React from 'react';
import { NavLink } from "react-router-dom";
import './Navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  return (
    // Main navigation bar container
    <nav className="navbar">
      
      {/* Left: Logo / Brand */}
      <div className="navbar-brand">
        <h2>Mosaic Connect</h2>
      </div>

      {/* Center: Search bar */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search for friends or events..."
          className="search-input"
        />
      </div>

      {/* Right: Navigation links */}
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Event
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Chat
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Map
        </NavLink>

        {/* Settings button (gear icon) */}
        <button className="settings-btn ms-3">
          <i className="bi bi-gear"></i>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
