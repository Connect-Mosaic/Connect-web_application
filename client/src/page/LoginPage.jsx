import React from "react";
import "./LoginPage.css";
import Navbar from "../components/Navbar"; // Import Navbar

function LoginPage() {
  return (
    <div className="login-page-wrapper">
      {/* Navbar appears at top */}
      <Navbar />

      {/* Main login content */}
      <div className="login-page">
        {/* Left Section */}
        <div className="login-left">
          <h1 className="login-title">Mosaic Connect</h1>
          <p className="login-subtitle">
            Connecting Collge/University students based on interests.
          </p>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <h2 className="login-header">Login</h2>
          <form className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              required
            />
            <button type="submit" className="btn btn-dark login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
