import React, { useEffect, useState } from "react";
import "./AdminManagement.css";
import AdminDashboard from "../components/AdminDashboard";

function AdminManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (err) {
      console.error("User fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page-container">

      {/* ─── TITLE ───────────────────────────── */}
      <h2 className="admin-title">User Management</h2>

      {/* ─── USER TABLE ───────────────────────── */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th>Joined Events</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-text">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="loading-text">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.location}</td>
                  <td>{user.joined_events.join(", ")}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="action-btn">Edit</button>
                    <button className="action-btn ban">Ban</button>
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── DASHBOARD SECTION BELOW TABLE ────── */}
      <AdminDashboard />

    </div>
  );
}

export default AdminManagementPage;
