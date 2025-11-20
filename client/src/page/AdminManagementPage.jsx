// src/pages/AdminManagementPage.jsx

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminManagement() {
  return (
    <div className="admin-page-container">
      <Navbar />

        {/* Page Header */}
        <div className="user-management-header">
            <h2>User Management</h2>
        </div>

        {/* Table Container */}
        <div className="user-table-container">
            <table className="user-table">
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

            {/* Empty state: table with no user rows yet */}
            <tbody className="user-table-body">
                {/* Later, map rows here from DB. For now, render an empty row to show structure */}
                <tr className="empty-row">
                <td colSpan="7" className="empty-message">
                    No users found.
                </td>
                </tr>
            </tbody>
            </table>
        </div>

        {/* Pagination Container */}
        <div className="pagination-container">
            <button className="pagination-btn prev-btn" disabled>
            prev
            </button>
            <button className="pagination-btn next-btn" disabled>
            next
            </button>
        </div>
        <Footer />
    </div>
  );
}

export default AdminManagement;
