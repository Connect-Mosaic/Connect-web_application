import React, { useEffect, useState } from "react";
import "./AdminManagement.css";

import AdminDashboard from "../components/AdminDashboard";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { api } from "../apis/client";

import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser
} from "../apis/admin";


function AdminManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Confirm modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // ------------------------------
  // FETCH USERS
  // ------------------------------
  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("User fetch error:", err);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // ------------------------------
  // MODAL HANDLERS
  // ------------------------------
  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // ------------------------------
  // SAVE USER (CREATE OR UPDATE)
  // ------------------------------
  const handleSaveUser = async (userData, userId) => {
    try {
      if (userId) {
        // --- UPDATE USER ---
        await updateAdminUser(userId, userData);

      } else {
        // --- CREATE USER VIA AUTH REGISTER ---
        console.log("Creating new user:", userData);

        await api.post("/api/auth/register", {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: "Default123!",  // You can choose your own default
          role: userData.role,
          location: userData.location
        });
      }

      await fetchUsers();
      handleCloseModal();

    } catch (error) {
      console.error("❌ Error saving user:", error);
    }
  };



  // ------------------------------
  // DELETE USER
  // ------------------------------
  const handleDeleteUser = async (userId) => {
    setConfirmMessage("Are you sure you want to delete this user?");
    setConfirmAction(() => () => confirmDeleteUser(userId));
    setConfirmModalOpen(true);
  };

  const confirmDeleteUser = async (userId) => {
    try {
      console.log("🗑 Deleting user:", userId);
      await deleteAdminUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
    setConfirmModalOpen(false);
  };


  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
        <button className="add-user-btn" onClick={handleAddUser}>
          + Add New User
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th>Joined Events</th>
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
              users.map((user) => {
                // Parse first/last fallback
                const [first, ...lastArr] = (user.name || "").split(" ");
                const last = lastArr.join(" ");

                return (
                  <tr key={user.id}>
                    <td>{user.first_name || first}</td>
                    <td>{user.last_name || last}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>{user.location}</td>

                    <td>{user.joined_events?.join(", ") || "None"}</td>

                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSave={handleSaveUser}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModalOpen(false)}
      />

      <AdminDashboard />
    </div>
  );
}

export default AdminManagementPage;
