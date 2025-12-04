import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { api } from "../apis/client";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search query from URL on component mount
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, []);

  // Handle search when query changes (with debounce)
  useEffect(() => {
    if (query.trim()) {
      const searchTimer = setTimeout(() => {
        performSearch(query);
        setSearchParams({ q: query });
      }, 500);

      return () => clearTimeout(searchTimer);
    } else {
      setResults({ users: [], events: [] });
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], events: [] });
      return;
    }

    setLoading(true);
    try {
      const data = await api.get(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (data.success) {
        setResults(data.data || { users: [], events: [] });
      } else {
        console.error("Search failed:", data.message);
        setResults({ users: [], events: [] });
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults({ users: [], events: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user._id}`);
  };

  const handleEventClick = (event) => {
    navigate(`/events/${event._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserFullName = (user) => {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  };

  const totalResults = results.users.length + results.events.length;

  return (
    <div className="search-page">
      {/* ===== Header container (purple) ===== */}
      <div className="search-header">
        <h3 className="search-title">Search Results</h3>

        <div className="search-bar-row">
          <input
            className="search-bar-input"
            type="text"
            placeholder="Search Students or Events..."
            value={query}
            onChange={handleSearchChange}
          />
          <button
            className="search-bar-button"
            type="button"
            onClick={() => performSearch(query)}
          >
            Search
          </button>
        </div>

        {query && (
          <p className="search-summary">
            Showing <strong>{totalResults}</strong> results for{" "}
            <span className="search-summary-query">"{query}"</span>
          </p>
        )}
      </div>

      {/* ===== Results container (white, two columns) ===== */}
      <div className="result-container">
        {loading ? (
          <p className="search-loading">Searching...</p>
        ) : !query ? (
          <p className="no-results no-query">
            Enter a search term to find users and events...
          </p>
        ) : (
          <>
            <div className="search-content">
              <div className="search-columns">
                {/* === People column === */}
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
                            {/* LEFT — Profile Icon + Main Info */}
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
                                    <i className="bi bi-envelope"></i> {user.email}
                                  </p>
                                )}

                                {user.university && (
                                  <p className="result-detail">
                                    <i className="bi bi-mortarboard"></i> {user.university}
                                  </p>
                                )}

                                {user.program && (
                                  <p className="result-detail">
                                    <i className="bi bi-journal-code"></i> {user.program}
                                  </p>
                                )}

                                {user.location && (
                                  <p className="result-detail">
                                    <i className="bi bi-geo-alt"></i> {user.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* RIGHT — Interest Tags */}
                            <div className="result-extra-container">
                              {user.interests?.length > 0 && (
                                <div className="result-interests">

                                  {/* Show first 3 interests */}
                                  {user.interests.slice(0, 3).map((int, i) => (
                                    <span key={i} className="interest-chip">{int}</span>
                                  ))}

                                  {/* If the user has more than 3 interests, show "+N" chip */}
                                  {user.interests.length > 3 && (
                                    <div className="interest-more-chip">
                                      <i className="bi bi-plus-circle"></i>
                                      <span className="more-count">
                                        +{user.interests.length - 3}
                                      </span>

                                      {/* Tooltip showing remaining interests */}
                                      <div className="interest-tooltip">
                                        {user.interests.slice(3).map((extra, i) => (
                                          <div key={i} className="tooltip-item">{extra}</div>
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

                {/* === Events column === */}
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
                            {/* LEFT — Icon + Main Details */}
                            <div className="result-left">
                              <div className="result-icon-container">
                                <i className="bi bi-calendar-event result-profile-placeholder"></i>
                              </div>

                              <div className="result-main-container">
                                <h4 className="result-title">{event.title}</h4>

                                {event.date && (
                                  <p className="result-subtitle">
                                    <i className="bi bi-calendar2-week"></i> {formatDate(event.date)}
                                    {event.startTime && ` • ${formatTime(event.startTime)}`}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                  </p>
                                )}

                                {event.location && (
                                  <p className="result-detail">
                                    <i className="bi bi-geo-alt"></i> {event.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* RIGHT — Tags / Interests */}
                            <div className="result-extra-container">
                              {event.interests?.length > 0 && (
                                <div className="result-interests">

                                  {/* Visible chips (max 3) */}
                                  {event.interests.slice(0, 3).map((int, i) => (
                                    <span key={i} className="interest-chip">{int}</span>
                                  ))}

                                  {/* Extra chip if there are more than 3 */}
                                  {event.interests.length > 3 && (
                                    <div className="interest-more-chip">
                                      <i className="bi bi-plus-circle"></i>
                                      <span className="more-count">
                                        +{event.interests.length - 3}
                                      </span>

                                      {/* Tooltip on hover */}
                                      <div className="interest-tooltip">
                                        {event.interests.slice(3).map((extra, i) => (
                                          <div key={i} className="tooltip-item">{extra}</div>
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
