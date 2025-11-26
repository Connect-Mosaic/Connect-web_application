import React, { useState, useEffect } from "react";
import "./UserFormModal.css";

function UserFormModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
    location: ""
  });

  useEffect(() => {
    if (!isOpen) return;

    console.log("🔍 Modal opened with user:", user);

    if (user) {
      // Handle old backend format (name: "First Last")
      const safeFirst =
        user.first_name && user.first_name !== "undefined"
          ? user.first_name
          : user.name?.split(" ")[0] || "";

      const safeLast =
        user.last_name && user.last_name !== "undefined"
          ? user.last_name
          : user.name?.split(" ").slice(1).join(" ") || "";

      console.log("🧩 Parsed First:", safeFirst, " Last:", safeLast);

      setFormData({
        first_name: safeFirst,
        last_name: safeLast,
        email: user.email || "",
        role: user.role || "user",
        location: user.location || ""
      });
    } else {
      // Reset when creating a new user
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        role: "user",
        location: ""
      });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Saving user:", formData);
    onSave(formData, user?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? "Edit User" : "Add New User"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">

          {/* First Name */}
          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {user ? "Update User" : "Create User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
