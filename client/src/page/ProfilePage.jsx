import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { uploadProfilePhoto, uploadGalleryPhoto } from "../apis/user";
import "./ProfilePage.css";
import placeholderProfile from "../image/placeholder-profile.jpg";

function ProfilePage() {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const user = jwt?.user;

  // If no user is logged in → show nothing
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

  const userId = user._id;

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gallery, setGallery] = useState(user?.photos || []);

  /* -------------------- PROFILE PHOTO UPLOAD -------------------- */
  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSaveProfile = async () => {
    try {
      await uploadProfilePhoto(userId, selectedFile);
      alert("Profile photo updated!");
      setSelectedFile(null);
    } catch (e) {
      console.error(e);
      alert("Failed to upload photo.");
    }
  };

  /* -------------------- GALLERY UPLOAD -------------------- */
  const handleGalleryTileClick = () => galleryInputRef.current.click();

  const handleGalleryChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadGalleryPhoto(userId, file);
      setGallery(result.photos);
    } catch (err) {
      console.error(err);
      alert("Unable to upload gallery photo.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-wrapper">
        <div className="profile-card">

          {/* LEFT COLUMN */}
          <div className="profile-left-column">

            {/* PROFILE IMAGE */}
            <div className="profile-image-wrapper" onClick={handleImageClick}>
              <img
                src={preview || user.profile_picture || placeholderProfile}
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

            {/* UNIVERSITY INFO */}
            <div className="sidebar-info">
              <p className="sidebar-title">University</p>

              {user.university ? (
                <p>{user.university}</p>
              ) : (
                <>
                  <div className="sidebar-line"></div>
                  <div className="sidebar-line short"></div>
                  <div className="sidebar-line"></div>
                </>
              )}
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

            <p className="profile-subtitle">
              {user.program || "Student"}
            </p>

            {/* INTERESTS */}
            <h3 className="section-title">Interests</h3>

            {user.interests && user.interests.length > 0 ? (
              <div className="interests-list">
                {user.interests.map((i, index) => (
                  <span className="interest-tag" key={index}>{i}</span>
                ))}
              </div>
            ) : (
              <>
                <div className="interests-grey-line"></div>
                <div className="interests-grey-line"></div>
                <div className="interests-grey-line short"></div>
              </>
            )}

            {/* PERSONAL INFO */}
            <h3 className="section-title">Personal Information</h3>

            {user.bio ? (
              <p>{user.bio}</p>
            ) : (
              <>
                <div className="personal-grey-line"></div>
                <div className="personal-grey-line"></div>
                <div className="personal-grey-line short"></div>
              </>
            )}

            {/* ALBUMS */}
            <h3 className="section-title">Albums</h3>

            <div className="album-grid">
              {gallery.map((photo, index) => (
                <div className="album-tile" key={index}>
                  <img
                    src={`http://localhost:3000${photo}`}
                    alt="gallery"
                    className="album-photo"
                  />
                </div>
              ))}

              {/* ADD PHOTO TILE */}
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

      <Footer />
    </>
  );
}

export default ProfilePage;
