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
              <button className="edit-profile-btn">Edit Profile</button>
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

      <Footer />
    </>
  );
}

export default ProfilePage;
