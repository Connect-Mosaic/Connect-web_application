import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { uploadProfilePhoto, uploadGalleryPhoto, getUser } from "../apis/user";
import "./ProfilePage.css";
import placeholderProfile from "../image/placeholder-profile.jpg";

/* ======================================================
      SAFE PARSER FOR JWT IN LOCALSTORAGE
====================================================== */

function safeParseJWT(raw) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return {
      token: raw,
      user: JSON.parse(localStorage.getItem("user") || "{}"),
    };
  }
}

function ProfilePage() {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ======================================================
          LOAD JWT SAFELY
  ====================================================== */

  const jwt = safeParseJWT(localStorage.getItem("jwt"));
  const token = jwt?.token || null;

  const [user, setUser] = useState(jwt?.user || null);
  const userId = user?._id || user?.id;

  /* ======================================================
          RE-FETCH USER ON PAGE LOAD
  ====================================================== */

  useEffect(() => {
    async function fetchUserFromDB() {
      if (!token || !userId) return;

      try {
        const freshUser = await getUser(userId, token);

        setUser(freshUser);

        const stored = safeParseJWT(localStorage.getItem("jwt"));
        stored.user = freshUser;
        localStorage.setItem("jwt", JSON.stringify(stored));
      } catch (err) {
        console.log("Error fetching fresh user:", err);
      }
    }

    fetchUserFromDB();
  }, [token, userId]);

  /* ======================================================
          STATE
  ====================================================== */

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gallery, setGallery] = useState(user?.photos || []);

  /* ======================================================
          EDIT PROFILE MODAL STATE
  ====================================================== */

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    university: user?.university || "",
    program: user?.program || "",
    bio: user?.bio || "",
    interests: user?.interests?.join(", ") || ""
  });

  /* Sync gallery with user data */
  useEffect(() => {
    if (user?.photos) setGallery(user.photos);
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>You are not logged in.</h2>
        </div>
        <Footer />
      </>
    );
  }

  /* ======================================================
          FULLSCREEN IMAGE POPUP
  ====================================================== */

  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openImage = (src) => {
    setFullscreenImage(src);
  };

  const closeImage = () => {
    setFullscreenImage(null);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeImage();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ======================================================
          PROFILE IMAGE UPLOAD
  ====================================================== */

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSaveProfile = async () => {
    try {
      const result = await uploadProfilePhoto(userId, selectedFile);

      if (result.success && result.user) {
        const updated = { ...user, profile_picture: result.user.profile_picture };
        setUser(updated);

        const savedJwt = safeParseJWT(localStorage.getItem("jwt"));
        savedJwt.user = updated;
        localStorage.setItem("jwt", JSON.stringify(savedJwt));
      }

      alert("Profile photo updated!");
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo.");
    }
  };

  /* ======================================================
          GALLERY UPLOAD
  ====================================================== */

  const handleGalleryTileClick = () => galleryInputRef.current.click();

  const handleGalleryChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadGalleryPhoto(userId, file);

      if (result.photos) {
        const updated = { ...user, photos: result.photos };
        setUser(updated);
        setGallery(result.photos);

        const savedJwt = safeParseJWT(localStorage.getItem("jwt"));
        savedJwt.user = updated;
        localStorage.setItem("jwt", JSON.stringify(savedJwt));
      }
    } catch (err) {
      console.error(err);
      alert("Unable to upload gallery photo.");
    }
  };

  /* ======================================================
          EDIT PROFILE MODAL COMPONENT
  ====================================================== */

  const EditProfileModal = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        // Prepare data for API call
        const updateData = {
          ...editFormData,
          interests: editFormData.interests.split(",").map(interest => interest.trim()).filter(interest => interest)
        };

        // Call your update user API
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
          // Update local state
          const updatedUser = { ...user, ...updateData };
          setUser(updatedUser);

          // Update localStorage
          const savedJwt = safeParseJWT(localStorage.getItem("jwt"));
          savedJwt.user = updatedUser;
          localStorage.setItem("jwt", JSON.stringify(savedJwt));

          // Close modal
          setIsEditModalOpen(false);
          alert("Profile updated successfully!");
        } else {
          alert("Failed to update profile: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Update profile error:", error);
        alert("Error updating profile. Please try again.");
      }
    };

    if (!isEditModalOpen) return null;

    return (
      <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
        <div className="modal-content profile-edit-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={() => setIsEditModalOpen(false)}>×</button>
          
          <h2>Edit Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={editFormData.university}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Program</label>
              <input
                type="text"
                name="program"
                value={editFormData.program}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Interests (comma separated)</label>
              <input
                type="text"
                name="interests"
                value={editFormData.interests}
                onChange={handleInputChange}
                placeholder="e.g., coding, basketball, music"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={editFormData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  /* ======================================================
          RENDER
  ====================================================== */

  return (
    <>
      <Navbar />

      <div className="profile-wrapper">
        <div className="profile-card">

          {/* LEFT COLUMN */}
          <div className="profile-left-column">

            <div className="profile-image-wrapper" onClick={handleImageClick}>
              <img
                src={
                  preview ||
                  (user.profile_picture
                    ? `http://localhost:3000${user.profile_picture}`
                    : placeholderProfile)
                }
                className="profile-image"
                alt="Profile"
              />
              <div className="upload-overlay">Upload</div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <div className="sidebar-info">
              <p className="sidebar-title">University</p>
              <p>{user.university || "N/A"}</p>
            </div>

            {selectedFile && (
              <button onClick={handleSaveProfile} className="save-photo-btn">
                Save Photo
              </button>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="profile-right-column">

            <div className="profile-header-top">
              <h1 className="profile-name">
                {user.first_name} {user.last_name}
              </h1>
              <button 
                className="edit-profile-btn" 
                onClick={() => {
                  // Pre-fill form with current user data
                  setEditFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    university: user.university || "",
                    program: user.program || "",
                    bio: user.bio || "",
                    interests: user.interests?.join(", ") || ""
                  });
                  setIsEditModalOpen(true);
                }}
              >
                Edit Profile
              </button>
            </div>

            <p className="profile-subtitle">{user.program || "Student"}</p>

            {/* INTERESTS */}
            <h3 className="section-title">Interests</h3>
            <div className="interests-list">
              {user.interests?.map((interest, index) => (
                <span className="interest-tag" key={index}>
                  {interest}
                </span>
              ))}
            </div>

            {/* BIO */}
            <h3 className="section-title">Personal Biography</h3>
            <p>{user.bio || "No biography yet."}</p>

            {/* ALBUMS */}
            <h3 className="section-title">Albums</h3>
            <div className="album-grid">
              {gallery.map((photo, index) => (
                <div className="album-tile" key={index}>
                  <img
                    src={`http://localhost:3000${photo}`}
                    alt="gallery"
                    className="album-photo"
                    onClick={() =>
                      openImage(`http://localhost:3000${photo}`)
                    }
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}

              <div className="album-tile add-photo" onClick={handleGalleryTileClick}>
                +
                <input
                  type="file"
                  ref={galleryInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleGalleryChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN POPUP */}
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeImage}>
          <img
            className="fullscreen-image"
            src={fullscreenImage}
            alt="Full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal />

      <Footer />
    </>
  );
}

export default ProfilePage;