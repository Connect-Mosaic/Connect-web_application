import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ isLoggedIn, onLogout }) {
  // Get logged-in user data
  const getUserData = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const user = getUserData();
  const isAdmin = user?.role === "admin";

  // ----------------------
  // 🔔 Notification State
  // ----------------------
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { message: "John liked your event!", time: "2m ago" },
    { message: "New user matched with your profile.", time: "10m ago" },
    { message: "Event reminder: Coding Meetup tonight!", time: "1h ago" }
  ];

  const unreadCount = notifications.length; // Replace later with dynamic value
  const notifRef = useRef();

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      
      {/* LEFT — Logo */}
      <div className="navbar-left">
        <h2>Mosaic Connect</h2>
      </div>

      {/* CENTER — Perfectly centered links */}
      <div className="navbar-center">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
        <NavLink to="/events" className="nav-link">Event</NavLink>
        <NavLink to="/map" className="nav-link">Map</NavLink>
        <NavLink to="/chat" className="nav-link">Chat</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>

        {isLoggedIn && isAdmin && (
          <NavLink to="/admin/users" className="nav-link admin-link">
            <i className="bi bi-shield-check"></i>
            <span className="admin-text">Admin</span>
          </NavLink>
        )}
      </div>

      {/* RIGHT — Notification + Logout */}
      <div className="navbar-right" ref={notifRef}>

        {/* Notification Bell */}
        <div className="notification-wrapper">
          <button className="notification-btn" onClick={() => setShowNotif(!showNotif)}>
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotif && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div key={idx} className="notification-item">
                    <p>{notif.message}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                ))
              ) : (
                <div className="notification-empty">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Login/Logout */}
        {!isLoggedIn ? (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        ) : (
          <button className="nav-link logout-link" onClick={onLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
