import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ isLoggedIn, onLogout }) {

  // -----------------------------
  // SAFE USER RETRIEVAL (from JWT)
  // -----------------------------
  const getUserData = () => {
    try {
      const raw = localStorage.getItem("jwt");
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return parsed.user || null;
    } catch {
      return null;
    }
  };

  const user = getUserData();

  // ⭐ FIX: Support both formats from backend
  const userId = user?._id || user?.id;

  const isAdmin = user?.role === "admin";

  // ----------------------
  // Notification State
  // ----------------------
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { message: "John liked your event!", time: "2m ago" },
    { message: "New user matched with your profile.", time: "10m ago" },
    { message: "Event reminder: Coding Meetup tonight!", time: "1h ago" }
  ];

  const unreadCount = notifications.length;
  const notifRef = useRef();

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
      <div className="navbar-left">
        <h2>Mosaic Connect</h2>
      </div>

      <div className="navbar-center">
        <NavLink to="/" end className="nav-link">Home</NavLink>

        {/* ⭐ FIX: use userId instead of user._id */}
        {userId && (
          <NavLink to={`/profile/${userId}`} className="nav-link">
            Profile
          </NavLink>
        )}

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

      <div className="navbar-right" ref={notifRef}>
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotif(!showNotif)}
          >
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="notification-dropdown">
              {notifications.map((notif, idx) => (
                <div key={idx} className="notification-item">
                  <p>{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

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
