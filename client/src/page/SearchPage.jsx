import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";

import FriendProfileModal from "../components/FriendProfile";

// API WRAPPERS
import {
  sendFriendRequestApi,
  acceptFriendRequestApi,
  rejectFriendRequestApi,
  cancelFriendRequestApi,
} from "../apis/friend";

import { createConversation } from "../apis/conversation";
import { getSearchResults } from "../apis/search";
import { createNotification } from "../apis/notification";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedUserId, setSelectedUserId] = useState(null);
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


  /* ---------------- UPDATE LOCAL STATE ---------------- */
  const updateLocalRelationship = (userId, newStatus) => {
    setResults((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u._id === userId ? { ...u, relationship: newStatus } : u
      ),
    }));
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
      const response = await getSearchResults(trimmed);

      if (response.success) {
        setResults({
          users: response.data.users,
          events: response.data.events.map((ev) => ({
            ...ev,
            eventState: ev.eventState || "none",
          })),
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

  /* ---------------- CHAT ---------------- */
  const createAndNavigateToChat = async (user) => {
    try {
      await createConversation({
        type: "private",
        participants: [user._id],
        display_name: "...",
      });


      if (res.success) {
        const convId = res.data.conversation_id || res.data._id;
        showToast("Conversation started!", "success");
        navigate(`/chat?conversation=${convId}`);
      }
    } catch (err) {
      console.error("Chat error:", err);
      showToast("Failed to start chat", "error");
    }
  };

  /* ============================================================
     FRIEND REQUEST ACTIONS + NOTIFICATIONS
  ============================================================ */

  const sendFriendRequest = async (user) => {
    try {
      const res = await sendFriendRequestApi(user._id);

      if (res.success) {
        updateLocalRelationship(user._id, "requested");
        showToast("Friend request sent!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to send friend request", "error");
    }
  };

  const acceptFriendRequest = async (user) => {
    try {
      const res = await acceptFriendRequestApi(user._id);

      if (res.success) {
        updateLocalRelationship(user._id, "friends");
        showToast("Friend request accepted!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to accept request", "error");
    }
  };

  const rejectFriendRequest = async (user) => {
    try {
      const res = await rejectFriendRequestApi(user._id);

      if (res.success) {
        updateLocalRelationship(user._id, "none");
        showToast("Request rejected.", "warning");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to reject request", "error");
    }
  };

  const cancelFriendRequest = async (user) => {
    try {
      const res = await cancelFriendRequestApi(user._id);

      if (res.success) {
        updateLocalRelationship(user._id, "none");
        showToast("Request canceled.", "warning");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel request", "error");
    }
  };

  /* ---------------- USER MODAL ---------------- */
  const handleUserClick = (user) => {
    setSelectedUserId(user._id);
    setShowModal(true);
  };

  /* ---------------- FRIEND BUTTON UI ---------------- */
  const renderFriendButton = (user) => {
    const status = user.relationship;

    if (status === "friends") {
      return (
        <button className="action-btn friend-btn">
          <i className="bi bi-person-check-fill"></i>
        </button>
      );
    }

    if (status === "requested") {
      return (
        <button
          className="action-btn friend-btn"
          onClick={(e) => {
            e.stopPropagation();
            cancelFriendRequest(user);
          }}
        >
          <i className="bi bi-hourglass-split"></i>
        </button>
      );
    }

    if (status === "pending") {
      return (
        <div className="friend-action-group">
          <button
            className="action-btn friend-btn accept"
            onClick={(e) => {
              e.stopPropagation();
              acceptFriendRequest(user);
            }}
          >
            <i className="bi bi-check-lg"></i>
          </button>
          <button
            className="action-btn friend-btn reject"
            onClick={(e) => {
              e.stopPropagation();
              rejectFriendRequest(user);
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      );
    }

    return (
      <button
        className="action-btn friend-btn"
        onClick={(e) => {
          e.stopPropagation();
          sendFriendRequest(user);
        }}
      >
        <i className="bi bi-person-plus"></i>
      </button>
    );
  };

  /* ---------------- MAIN RENDER ---------------- */
  const total = results.users.length + results.events.length;

  return (
    <div className="search-page">
      {/* HEADER */}
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

          <button
            className="search-bar-button"
            onClick={() => performSearch(query)}
          >
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

      {/* RESULTS */}
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

              {/* USERS */}
              <section className="search-column">
                <h4 className="column-title">People</h4>
                <p className="column-subtitle">
                  Students who match your interests
                </p>

                {results.users.length > 0 ? (
                  <div className="search-results">
                    {results.users.map((user) => (
                      <div
                        key={user._id}
                        className="search-result-card"
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="result-content">
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

                          <div className="result-extra-container">
                            {/* INTERESTS */}
                            {user.interests?.length > 0 && (
                              <div className="result-interests">
                                {user.interests.slice(0, 3).map((int, i) => (
                                  <span key={i} className="interest-chip">
                                    {int}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="divider-dot"></div>

                            {/* FRIEND BUTTON */}
                            {renderFriendButton(user)}

                            {/* CHAT BUTTON */}
                            <button
                              className="action-btn message-btn ms-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                createAndNavigateToChat(user);
                              }}
                            >
                              <i className="bi bi-chat-dots"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No matching students found.</p>
                )}
              </section>

              {/* EVENTS */}
              <section className="search-column">
                <h4 className="column-title">Events</h4>
                <p className="column-subtitle">
                  Upcoming events that match your interests
                </p>

                {results.events.length > 0 ? (
                  <div className="search-results">
                    {results.events.map((ev) => (
                      <div
                        key={ev._id}
                        className="search-result-card"
                        onClick={() => navigate(`/events/${ev._id}`)}
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

      {/* MODAL */}
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
