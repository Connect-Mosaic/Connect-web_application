import React, { useState } from "react";
import "./SignupPage.css";
import Navbar from "../components/Navbar";
import { register } from "../apis/api-auth";
import Footer from "../components/Footer";

function SignupPage() {
  // Full form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    program: "",
    biography: "",
    interests: "",
  });

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Password validation
  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
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
      alert("Password must be at least 8 characters, including letters and numbers.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.university.trim().length < 2) {
      alert("Please enter your university.");
      return;
    }

    if (formData.program.trim().length < 2) {
      alert("Please enter your program.");
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

    // REQUEST BODY FOR BACKEND
    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,

      // new correct fields
      university: formData.university,
      program: formData.program,

      // backend expects "bio"
      bio: formData.biography,

      // convert comma-separated interests -> array
      interests: formData.interests.split(",").map((i) => i.trim()),
    };

    try {
      const res = await register(requestBody);

      if (res.success) {
        alert("Account created successfully!");
        navigate("/login");
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
                name="confirmPassword"
                placeholder="Retype Password"
                className="signup-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="signup-input full"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* University */}
            <input
              type="text"
              name="university"
              placeholder="University"
              className="signup-input full"
              value={formData.university}
              onChange={handleChange}
              required
            />

            {/* Program */}
            <input
              type="text"
              name="program"
              placeholder="Program of Study"
              className="signup-input full"
              value={formData.program}
              onChange={handleChange}
              required
            />

            {/* Biography */}
            <input
              type="text"
              name="biography"
              placeholder="Personal Biography"
              className="signup-input full"
              value={formData.biography}
              onChange={handleChange}
            />

            {/* Interests */}
            <input
              type="text"
              name="interests"
              placeholder="Interests (comma separated)"
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

      <Footer />
    </div>
  );
}

export default SignupPage;
