// src/pages/AdminDashboard.jsx

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminDashboard() {
  return (
    <>
      {/* Global Navbar */}
      <Navbar />

      {/* Dashboard Body Container */}
      <div className="admin-dashboard-page">

        {/* Dashboard Header */}
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
        </div>

        {/* Stats Section */}
        <div className="dashboard-stats-container">

          {/* Row 1 */}
          <div className="dashboard-row">
            <div className="dashboard-stat-box">
              <p className="stat-title">Total Users</p>
              <p className="stat-value">0</p>
            </div>

            <div className="dashboard-stat-box">
              <p className="stat-title">Active Users Today</p>
              <p className="stat-value">0</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="dashboard-row">
            <div className="dashboard-stat-box">
              <p className="stat-title">New Signups this week</p>
              <p className="stat-value">0</p>
            </div>

            <div className="dashboard-stat-box">
              <p className="stat-title">New Signups this month</p>
              <p className="stat-value">0</p>
            </div>
          </div>

        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

export default AdminDashboard;