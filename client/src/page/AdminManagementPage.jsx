import React, { useEffect, useState } from "react";
import "./AdminManagement.css";
import AdminDashboard from "../components/AdminDashboard";
import UserFormModal from "../components/UserFormModal";
import ConfirmModal from "../components/ConfirmModal";


function AdminManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  //comfirm modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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

  // Modal handlers
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

  const handleSaveUser = async (userData, userId) => {
    try {
      if (userId) {
        // Update existing user
        console.log("Updating user:", userId, userData);
        // TODO: Add your update API call here
        // await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify(userData),
        // });
      } else {
        // Create new user
        console.log("Creating user:", userData);
        // TODO: Add your create API call here
        // await fetch('http://localhost:3000/api/admin/users', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify(userData),
        // });
      }
      
      // Refresh users list after save
      await fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmMessage("Are you sure you want to delete this user?");
    setConfirmAction(() => () => confirmDeleteUser(userId));
    setConfirmModalOpen(true);
  };
  const confirmDeleteUser = async (userId) => {
    try {
      console.log("Deleting user:", userId);
      await fetchUsers(); // reflesh users
    } catch(err){
      console.error(" error deleting users",err);
    }
    setConfirmModalOpen(false);
  };

  const handleBanUser = async (userId) => {
    setConfirmMessage("Are you sure you want to ban this user?");
    setConfirmAction(() => () => confirmBanUser(userId));
    setConfirmModalOpen(true);
  };
  const confirmBanUser = async (userId) => {
    try {
      console.log ("Ban User:",userId);
      await fetchUsers();
    } catch (err) {
      console.error("Error ban user:",err);
    }
    setConfirmModalOpen(false);
  };

  return (
    <div className="admin-page-container">

      {/* ─── HEADER WITH ADD BUTTON ───────────── */}
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
        <button className="add-user-btn" onClick={handleAddUser}>
          + Add New User
        </button>
      </div>

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
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.location}</td>
                  <td>{user.joined_events?.join(", ") || "None"}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn ban"
                      onClick={() => handleBanUser(user.id)}
                    >
                      Ban
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── USER FORM MODAL ─────────────────── */}
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

      {/* ─── DASHBOARD SECTION BELOW TABLE ────── */}
      <AdminDashboard />

    </div>
  );
}

export default AdminManagementPage;