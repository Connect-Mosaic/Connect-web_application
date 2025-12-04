import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { api } from "../apis/client";

// ✅ Use the modal component instead of inline modal
import FriendProfileModal from "../components/FriendProfile";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedUserId, setSelectedUserId] = useState(null); // ONLY store the ID  
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  /* ---------------- TOAST ---------------- */
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  /* ---------------- RELATIONSHIP DETECTOR ---------------- */
  const detectRelationship = (user) => {
    const me = JSON.parse(localStorage.getItem("user"));
    if (!me) return "none";

    const myId = me._id;

    if (user.friends?.includes(myId)) return "friends";
    if (user.friendRequests?.includes(myId)) return "pending";
    if (user.sentRequests?.includes(myId)) return "requested";

    return "none";
  };

  /* ---------------- SEARCH ---------------- */
  const performSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim();
    setHasSearched(true);
    setSearchParams({ q: trimmed });

    if (!trimmed) {
      setResults({ users: [], events: [] });
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(`/api/search?q=${encodeURIComponent(trimmed)}`);

      if (response.success) {
        const enrichedUsers = response.data.users.map((u) => ({
          ...u,
          relationship: detectRelationship(u),
        }));

        const enrichedEvents = response.data.events.map((ev) => ({
          ...ev,
          eventState: ev.eventState || "none",
        }));

        setResults({
          users: enrichedUsers,
          events: enrichedEvents,
        });
      } else {
        setResults({ users: [], events: [] });
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EVENT JOIN/LEAVE ---------------- */
  const joinEvent = async (eventId) => {
    try {
      const res = await api.post(`/api/events/${eventId}/join`);
      if (res.success) {
        showToast("Joined event!", "success");
      }
    } catch {
      showToast("Failed to join event", "error");
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      const res = await api.post(`/api/events/${eventId}/leave`);
      if (res.success) {
        showToast("Left event", "warning");
      }
    } catch {
      showToast("Failed to leave event", "error");
    }
  };

  /* ---------------- USER CLICK → OPEN MODAL ---------------- */
  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
    setShowModal(true);
  };

  const handleEventClick = (event) => navigate(`/events/${event._id}`);

  /* ---------------- RENDER FRIEND BUTTON ---------------- */
  const renderFriendButton = (user) => {
    const s = user.relationship || "none";

    if (s === "friends")
      return (
        <button className="action-btn friend-btn">
          <i className="bi bi-person-check-fill"></i>
        </button>
      );

    if (s === "requested")
      return (
        <button className="action-btn friend-btn">
          <i className="bi bi-hourglass-split"></i>
        </button>
      );

    if (s === "pending")
      return (
        <div className="friend-action-group">
          <button className="action-btn friend-btn accept">
            <i className="bi bi-check-lg"></i>
          </button>
          <button className="action-btn friend-btn reject">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      );

    return (
      <button className="action-btn friend-btn">
        <i className="bi bi-person-plus"></i>
      </button>
    );
  };

  /* ---------------- RENDER ---------------- */
  const total = results.users.length + results.events.length;

  return (
    <div className="search-page">
      <div className="search-header">
        <h3 className="search-title">Search Results</h3>

        <div className="search-bar-row">
          <input
            className="search-bar-input"
            type="text"
            placeholder="Search Students or Events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && performSearch(query)}
          />
          <button className="search-bar-button" onClick={() => performSearch(query)}>
            Search
          </button>
        </div>

        {hasSearched && (
          <p className="search-summary">
            Showing <strong>{total}</strong> results for{" "}
            <span className="search-summary-query">"{query}"</span>
          </p>
        )}
      </div>

      {/* ------------ RESULTS ------------- */}
      <div className="result-container">
        {loading ? (
          <p className="search-loading">Searching...</p>
        ) : !hasSearched ? (
          <p className="no-results no-query">
            Enter a search term to find users and events...
          </p>
        ) : (
          <div className="search-content">
            <div className="search-columns">

              {/* ------------ USERS ------------- */}
              <section className="search-column">
                <h4 className="column-title">People</h4>
                <p className="column-subtitle">Students who match your interests</p>

                {results.users.length > 0 ? (
                  <div className="search-results">
                    {results.users.map((user) => (
                      <div
                        key={user._id}
                        className="search-result-card"
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="result-content">

                          {/* IMAGE */}
                          <div className="result-left">
                            <div className="result-icon-container">
                              {user.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  className="result-profile-image"
                                  alt="profile"
                                />
                              ) : (
                                <i className="bi bi-person-circle result-profile-placeholder"></i>
                              )}
                            </div>

                            {/* MAIN INFO */}
                            <div className="result-main-container">
                              <h4 className="result-title">
                                {user.first_name} {user.last_name}
                              </h4>

                              {user.email && (
                                <p className="result-subtitle">
                                  <i className="bi bi-envelope"></i> {user.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* RIGHT SIDE */}
                          <div className="result-extra-container">
                            {/* INTEREST TAGS */}
                            {user.interests?.length > 0 && (
                              <div className="result-interests">
                                {user.interests.slice(0, 3).map((int, i) => (
                                  <span key={i} className="interest-chip">{int}</span>
                                ))}
                              </div>
                            )}

                            {/* FRIEND BUTTON */}
                            <div className="divider-dot"></div>
                            {renderFriendButton(user)}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No matching students found.</p>
                )}
              </section>

              {/* ------------ EVENTS ------------- */}
              <section className="search-column">
                <h4 className="column-title">Events</h4>
                <p className="column-subtitle">Upcoming events that match your interests</p>

                {results.events.length > 0 ? (
                  <div className="search-results">
                    {results.events.map((ev) => (
                      <div
                        key={ev._id}
                        className="search-result-card"
                        onClick={() => handleEventClick(ev)}
                      >
                        <div className="result-content">
                          <div className="result-left">
                            <div className="result-icon-container">
                              <i className="bi bi-calendar-event result-profile-placeholder"></i>
                            </div>

                            <div className="result-main-container">
                              <h4 className="result-title">{ev.title}</h4>
                            </div>
                          </div>

                          <div className="result-extra-container">
                            {ev.eventState === "joined" ? (
                              <button className="action-btn join-btn joined">
                                <i className="bi bi-check-circle-fill"></i>
                              </button>
                            ) : (
                              <button className="action-btn join-btn">
                                <i className="bi bi-plus-circle"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No matching events found.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </div>

      {/* ===============================
            FRIEND PROFILE MODAL
          =============================== */}
      {showModal && selectedUserId && (
        <FriendProfileModal
          userId={selectedUserId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default SearchPage;
