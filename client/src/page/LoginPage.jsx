import React, { useState } from "react";
import "./LoginPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
          rememberMe: false,
        }),
      });

      const data = await res.json();

      if (data.status === "error") {
        setError(data.message);
        return;
      }

      // Login Seccess
      localStorage.setItem("jwt", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Update Login State
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <Navbar />

      <div className="login-page">
        <div className="login-left">
          <h1 className="login-title">Mosaic Connect</h1>
          <p className="login-subtitle">
            Connecting College/University students based on interests.
          </p>
        </div>

        <div className="login-right">
          <h2 className="login-header">Login</h2>

          {error && <p className="error-msg">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-dark login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;
