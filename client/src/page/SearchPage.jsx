import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { api } from "../apis/client";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ----------------------------------------
     Load query from URL on mount ONLY (DO NOT SEARCH automatically)
  ---------------------------------------- */
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
      // Do NOT call performSearch here
    }
  }, []);

  /* ----------------------------------------
     Handle pressing Enter
  ---------------------------------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch(query);
    }
  };

  /* ----------------------------------------
     Perform Search ONLY when manually called
  ---------------------------------------- */
  const performSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim();

    // Mark that the user intentionally searched
    setHasSearched(true);

    // Update URL
    setSearchParams({ q: trimmed });

    // If empty search → clear results
    if (!trimmed) {
      setResults({ users: [], events: [] });
      return;
    }

    setLoading(true);

    try {
      const data = await api.get(`/api/search?q=${encodeURIComponent(trimmed)}`);

      if (data.success) {
        setResults(data.data || { users: [], events: [] });
      } else {
        setResults({ users: [], events: [] });
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults({ users: [], events: [] });
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     Format Helpers
  ---------------------------------------- */
  const handleSearchChange = (e) => setQuery(e.target.value);

  const handleUserClick = (user) => navigate(`/profile/${user._id}`);
  const handleEventClick = (event) => navigate(`/events/${event._id}`);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  const formatTime = (time) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getUserFullName = (u) =>
    `${u.first_name || ""} ${u.last_name || ""}`.trim();

  const totalResults = results.users.length + results.events.length;

  /* ======================================================================
     RENDER
  ====================================================================== */
  return (
    <div className="search-page">
      {/* ================= HEADER ================= */}
      <div className="search-header">
        <h3 className="search-title">Search Results</h3>

        <div className="search-bar-row">
          <input
            className="search-bar-input"
            type="text"
            placeholder="Search Students or Events..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="search-bar-button"
            type="button"
            onClick={() => performSearch(query)}
          >
            Search
          </button>
        </div>

        {hasSearched && (
          <p className="search-summary">
            Showing <strong>{totalResults}</strong> results for{" "}
            <span className="search-summary-query">"{query}"</span>
          </p>
        )}
      </div>

      {/* ================= RESULTS CONTAINER ================= */}
      <div className="result-container">
        {loading ? (
          <p className="search-loading">Searching...</p>
        ) : !hasSearched ? (
          <p className="no-results no-query">
            Enter a search term to find users and events...
          </p>
        ) : (
          <>
            <div className="search-content">
              <div className="search-columns">
                {/* ================= PEOPLE COLUMN ================= */}
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
                            {/* LEFT SIDE */}
                            <div className="result-left">
                              <div className="result-icon-container">
                                {user.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt="profile"
                                    className="result-profile-image"
                                  />
                                ) : (
                                  <i className="bi bi-person-circle result-profile-placeholder"></i>
                                )}
                              </div>

                              <div className="result-main-container">
                                <h4 className="result-title">
                                  {getUserFullName(user) || "Unnamed user"}
                                </h4>

                                {user.email && (
                                  <p className="result-subtitle">
                                    <i className="bi bi-envelope"></i>{" "}
                                    {user.email}
                                  </p>
                                )}

                                {user.university && (
                                  <p className="result-detail">
                                    <i className="bi bi-mortarboard"></i>{" "}
                                    {user.university}
                                  </p>
                                )}

                                {user.program && (
                                  <p className="result-detail">
                                    <i className="bi bi-journal-code"></i>{" "}
                                    {user.program}
                                  </p>
                                )}

                                {user.location && (
                                  <p className="result-detail">
                                    <i className="bi bi-geo-alt"></i>{" "}
                                    {user.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* RIGHT SIDE — Interests */}
                            <div className="result-extra-container">
                              <button className="action-btn message-btn">
                                <i className="bi bi-chat-dots"></i>
                              </button>

                              {user.interests?.length > 0 && (
                                <div className="result-interests">
                                  {/* first 3 */}
                                  {user.interests.slice(0, 3).map((int, i) => (
                                    <span key={i} className="interest-chip">
                                      {int}
                                    </span>
                                  ))}

                                  {/* More */}
                                  {user.interests.length > 3 && (
                                    <div className="interest-more-chip">
                                      <i className="bi bi-plus-circle"></i>
                                      <span className="more-count">
                                        +{user.interests.length - 3}
                                      </span>

                                      <div className="interest-tooltip">
                                        {user.interests
                                          .slice(3)
                                          .map((extra, i) => (
                                            <div
                                              key={i}
                                              className="tooltip-item"
                                            >
                                              {extra}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No matching students found.</p>
                  )}
                </section>

                {/* ================= EVENTS COLUMN ================= */}
                <section className="search-column">
                  <h4 className="column-title">Events</h4>
                  <p className="column-subtitle">
                    Upcoming events that match your interests
                  </p>

                  {results.events.length > 0 ? (
                    <div className="search-results">
                      {results.events.map((event) => (
                        <div
                          key={event._id}
                          className="search-result-card"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="result-content">
                            {/* LEFT */}
                            <div className="result-left">
                              <div className="result-icon-container">
                                <i className="bi bi-calendar-event result-profile-placeholder"></i>
                              </div>

                              <div className="result-main-container">
                                <h4 className="result-title">{event.title}</h4>

                                {event.date && (
                                  <p className="result-subtitle">
                                    <i className="bi bi-calendar2-week"></i>{" "}
                                    {formatDate(event.date)}
                                    {event.startTime &&
                                      ` • ${formatTime(event.startTime)}`}
                                    {event.endTime &&
                                      ` - ${formatTime(event.endTime)}`}
                                  </p>
                                )}

                                {event.location && (
                                  <p className="result-detail">
                                    <i className="bi bi-geo-alt"></i>{" "}
                                    {event.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* RIGHT — Interests */}
                            <div className="result-extra-container">
                              <button className="action-btn join-btn">
                                <i className="bi bi-plus-circle"></i>
                              </button>

                              {event.interests?.length > 0 && (
                                <div className="result-interests">
                                  {event.interests
                                    .slice(0, 3)
                                    .map((int, i) => (
                                      <span key={i} className="interest-chip">
                                        {int}
                                      </span>
                                    ))}

                                  {event.interests.length > 3 && (
                                    <div className="interest-more-chip">
                                      <i className="bi bi-plus-circle"></i>
                                      <span className="more-count">
                                        +
                                        {event.interests.length - 3}
                                      </span>

                                      <div className="interest-tooltip">
                                        {event.interests
                                          .slice(3)
                                          .map((extra, i) => (
                                            <div
                                              key={i}
                                              className="tooltip-item"
                                            >
                                              {extra}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-text">No matching events found.</p>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
