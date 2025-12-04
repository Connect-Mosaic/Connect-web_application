import React, { useEffect, useState } from "react";
import { getUser } from "../apis/user.js";
import "./FriendProfile.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function FriendProfileModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getUser(userId);
        const data = res.data?.user || res.data || res;
        setUser(data);
      } catch (err) {
        console.error("Error loading modal user:", err);
      }
    }
    loadUser();
  }, [userId]);

  if (!user) return null;

  const openImage = (src) => setFullscreenImage(src);
  const closeImage = () => setFullscreenImage(null);

  return (
    <div className="fp-overlay" onClick={onClose}>
      <div className="fp-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="fp-close-btn" onClick={onClose}>×</button>

        {/* Header */}
        <div className="fp-header">
          <img
            src={
              user.profile_picture
                ? `${BASE_URL}${user.profile_picture}`
                : "/default_profile.png"
            }
            className="fp-profile-img"
            onClick={() =>
              user.profile_picture &&
              openImage(`${BASE_URL}${user.profile_picture}`)
            }
          />

          <div className="fp-header-text">
            <h2>{user.first_name} {user.last_name}</h2>
            <p className="fp-email">{user.email}</p>
          </div>
        </div>

        {/* Interests */}
        <h3 className="fp-section-title">Interests</h3>
        <div className="fp-interests">
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((i, index) => (
              <span key={index} className="fp-chip">{i}</span>
            ))
          ) : (
            <p>No interests listed.</p>
          )}
        </div>

        {/* About */}
        <h3 className="fp-section-title">About</h3>
        <p>{user.bio || "No bio provided."}</p>

        {/* Album */}
        <h3 className="fp-section-title">Album</h3>
        <div className="fp-album-grid">
          {user.photos && user.photos?.length > 0 ? (
            user.photos.map((photo, index) => (
              <img
                key={index}
                src={`${BASE_URL}${photo}`}
                className="fp-album-photo"
                onClick={() => openImage(`${BASE_URL}${photo}`)}
              />
            ))
          ) : (
            <p>No photos yet.</p>
          )}
        </div>
      </div>

      {/* Fullscreen Image */}
      {fullscreenImage && (
        <div className="fp-fullscreen" onClick={closeImage}>
          <img src={fullscreenImage} className="fp-fullscreen-img" />
        </div>
      )}
    </div>
  );
}