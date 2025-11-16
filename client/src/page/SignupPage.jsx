import React, { useState } from "react";
import "./SignupPage.css";
import Navbar from "../components/Navbar";
import { register } from "../apis/api-auth";

function SignupPage() {
  // Form data (clean, backend-ready)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    biography: "",
    interests: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Email validation
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Password validation (at least 8 characters, letters + numbers)
  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ============================
    // VALIDATION
    // ============================

    if (formData.firstName.trim().length < 2) {
      alert("First name must be at least 2 characters.");
      return;
    }

    if (formData.lastName.trim().length < 2) {
      alert("Last name must be at least 2 characters.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(formData.password)) {
      alert("Password must be at least 8 characters, contain letters and numbers.");
      return;
    }

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.address.trim().length < 3) {
      alert("Please enter a valid address.");
      return;
    }

    if (formData.biography.trim().length < 5) {
      alert("Biography must be at least 5 characters.");
      return;
    }

    if (formData.interests.trim().length < 2) {
      alert("Please enter at least one interest.");
      return;
    }


    try {
      const requestBody = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        biography: formData.biography,
        interests: formData.interests.split(",").map((interest) => interest.trim()),
      };
      const res = await register(requestBody);

      console.log("Backend response:", res);

      if (res.success) {
        alert("Account created successfully!");
        // redirect to home page
        window.location.href = "/";
      } else {
        alert("Signup failed: " + res.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="signup-wrapper">
      <Navbar />

      <div className="signup-full-bg">
        <div className="signup-container">

          {/* Header */}
          <div className="signup-header-section">
            <h1 className="signup-title">Connect</h1>
            <div className="signup-divider-vertical"></div>
            <p className="signup-subtitle">
              Connecting University students based on interests
            </p>
          </div>

          <h2 className="signup-form-title">Register</h2>
          <hr className="signup-divider" />

          <form className="signup-form" onSubmit={handleSubmit}>

            {/* Row 1 */}
            <div className="signup-row">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="signup-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="signup-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 2 */}
            <div className="signup-row">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="signup-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                placeholder="Retype Password"
                className="signup-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="signup-input full"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              className="signup-input full"
              value={formData.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="biography"
              placeholder="Personal Biography"
              className="signup-input full"
              value={formData.biography}
              onChange={handleChange}
            />

            <input
              type="text"
              name="interests"
              placeholder="Interests"
              className="signup-input full"
              value={formData.interests}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-dark signup-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
