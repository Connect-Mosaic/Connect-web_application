import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwt");

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p>Total Users</p>
          <h3>{stats.total_users}</h3>
        </div>

        <div className="dashboard-card">
          <p>Active Users Today</p>
          <h3>{stats.active_users_today}</h3>
        </div>

        <div className="dashboard-card">
          <p>New Signups this Week</p>
          <h3>{stats.new_signups_this_week}</h3>
        </div>

        <div className="dashboard-card">
          <p>New Signups this Month</p>
          <h3>{stats.new_signups_this_month}</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
