import React, { useRef, useState, useEffect } from "react";
import {
  uploadProfilePhoto,
  uploadGalleryPhoto,
  getUser,
  updateUser,
} from "../apis/user";
import "./ProfilePage.css";
import placeholderProfile from "../image/placeholder-profile.jpg";
import { useNavigate } from "react-router-dom";
import { fileURL } from "../apis/client";

/* ======================================================
      SAFE JWT PARSING FOR LOCALSTORAGE
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

/* ======================================================
      PROFILE PAGE COMPONENT
====================================================== */
function ProfilePage() {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const navigate = useNavigate();

  /* ======================================================
          LOAD JWT + INITIAL USER
  ====================================================== */
  const initialJwt = safeParseJWT(localStorage.getItem("jwt") ?? null) || {};
  const [jwtState, setJwtState] = useState(initialJwt);
  const token = jwtState?.token || null;

  const [userState, setUserState] = useState(jwtState?.user || null);
  const userId = userState?._id || userState?.id;

  /* ======================================================
      IMAGE CACHE KEY (FIXES OLD PHOTO ISSUE)
  ====================================================== */
  const [cacheKey, setCacheKey] = useState(Date.now());

  /* ======================================================
      SYNC USER + LOCAL STORAGE
  ====================================================== */
  const syncUser = (updatedUser) => {
    if (updatedUser.profile_picture) {
      updatedUser.profile_picture = `${updatedUser.profile_picture}?t=${Date.now()}`;
    }

    setUserState(updatedUser);

    const stored = safeParseJWT(localStorage.getItem("jwt")) || {};
    const newJwt = {
      token: stored.token || token || jwtState.token || null,
      user: updatedUser,
    };

    setJwtState(newJwt);
    localStorage.setItem("jwt", JSON.stringify(newJwt));
  };

  /* ======================================================
      REFETCH USER ON MOUNT
  ====================================================== */
  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!token || !userId) return;

      try {
        const res = await getUser(userId);
        const data = res?.data || res;
        const freshUser = data.user || data;
        syncUser(freshUser);
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };

    fetchUserFromDB();
  }, []);

  /* ======================================================
          PROFILE PHOTO PREVIEW STATE
  ====================================================== */
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  /* ======================================================
          FULLSCREEN POPUP
  ====================================================== */
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const openImage = (src) => setFullscreenImage(src);
  const closeImage = () => setFullscreenImage(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeImage();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ======================================================
          EDIT PROFILE MODAL
  ====================================================== */
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    first_name: userState?.first_name || "",
    last_name: userState?.last_name || "",
    university: userState?.university || "",
    program: userState?.program || "",
    bio: userState?.bio || "",
    interests: userState?.interests ? userState.interests.join(", ") : "",
  });

  const openEditModal = () => {
    setEditForm({
      first_name: userState?.first_name || "",
      last_name: userState?.last_name || "",
      university: userState?.university || "",
      program: userState?.program || "",
      bio: userState?.bio || "",
      interests: userState?.interests ? userState.interests.join(", ") : "",
    });
    setIsEditing(true);
  };

  const closeEditModal = () => setIsEditing(false);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  /* ======================================================
      SAVE PROFILE
  ====================================================== */
  const saveProfileChanges = async () => {
    if (!userId) return;

    try {
      const updates = {
        ...editForm,
        interests: editForm.interests
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i.length > 0),
      };

      const res = await updateUser(userId, updates);
      const data = res?.data || res;
      const updatedUser = data.user || data;

      syncUser(updatedUser);

      alert("Profile updated!");
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  /* ======================================================
          PROFILE PHOTO UPLOAD
  ====================================================== */
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSaveProfile = async () => {
    if (!userId || !selectedFile) return;

    try {
      const result = await uploadProfilePhoto(userId, selectedFile);
      const updatedUser = result?.data?.data || result?.data;
      console.log("Upload response:", result);
      console.log("updatedUser:", updatedUser);

      if (updatedUser) {
        syncUser(updatedUser);
        setCacheKey(Date.now());
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
  const handleGalleryTileClick = () => galleryInputRef.current?.click();

  const handleGalleryChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadGalleryPhoto(userId, file);
      const updatedUser = result?.data?.data?.user || result?.data?.user;

      if (updatedUser) {
        syncUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to upload gallery photo.");
    }
  };

  /* ======================================================
          NOT LOGGED IN → RETURN
  ====================================================== */
  if (!userState) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>You are not logged in.</h2>
      </div>
    );
  }

  const user = userState;

  /* ======================================================
          RENDER UI
  ====================================================== */
  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-card">
          {/* LEFT COLUMN */}
          <div className="profile-left-column">
            <div className="profile-image-wrapper" onClick={handleImageClick}>
              <img
                src={
                  preview ||
                  `${fileURL(user.profile_picture)}?k=${cacheKey}` ||
                  placeholderProfile
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

              <button className="edit-profile-btn" onClick={openEditModal}>
                Edit Profile
              </button>
            </div>

            <p className="profile-subtitle">{user.program || "Student"}</p>

            <h3 className="section-title">Interests</h3>
            <div className="interests-list">
              {user.interests?.map((interest, index) => (
                <span className="interest-tag" key={index}>
                  {interest}
                </span>
              ))}
            </div>

            <h3 className="section-title">Personal Biography</h3>
            <p>{user.bio || "No biography yet."}</p>

            <h3 className="section-title">Albums</h3>
            <div className="album-grid">
              {user.photos?.map((photo, index) => (
                <div className="album-tile" key={index}>
                  <img
                    src={fileURL(photo)}
                    alt="gallery"
                    className="album-photo"
                    onClick={() => openImage(fileURL(photo))}
                  />
                </div>
              ))}

              <div
                className="album-tile add-photo"
                onClick={handleGalleryTileClick}
              >
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

      {isEditing && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <div className="modal-field">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={editForm.first_name}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={editForm.last_name}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={editForm.university}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>Program</label>
              <input
                type="text"
                name="program"
                value={editForm.program}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-field">
              <label>Biography</label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
              ></textarea>
            </div>

            <div className="modal-field">
              <label>Interests (comma separated)</label>
              <input
                type="text"
                name="interests"
                value={editForm.interests}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveProfileChanges}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
