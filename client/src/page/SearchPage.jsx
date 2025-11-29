import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchPage.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get search query from URL on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
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
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

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
    // Navigate to user profile
    navigate(`/profile/${user._id}`);
  };

  const handleEventClick = (event) => {
    // Navigate to event details
    navigate(`/events/${event._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const getUserFullName = (user) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  const totalResults = results.users.length + results.events.length;

  return (
    <div className="search-page">
      <h3>Search</h3>
      <input
        className="search-input"
        type="text"
        placeholder="Search for users, events..."
        value={query}
        onChange={handleSearchChange}
      />

      <div className="result-container">
        {loading ? (
          <p className="search-loading">Searching...</p>
        ) : query ? (
          <>
            <p>
              Showing {totalResults} results for: <strong>"{query}"</strong>
            </p>
            
            {/* Users Results */}
            {results.users.length > 0 && (
              <div className="results-section">
                <h4 className="section-title">Users ({results.users.length})</h4>
                <div className="search-results">
                  {results.users.map((user) => (
                    <div 
                      key={user._id} 
                      className="search-result-card"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="result-icon">👤</div>
                      <div className="result-content">
                        <h4 className="result-title">{getUserFullName(user)}</h4>
                        {user.email && (
                          <p className="result-subtitle">{user.email}</p>
                        )}
                        {user.university && (
                          <p className="result-detail">🎓 {user.university}</p>
                        )}
                        {user.program && (
                          <p className="result-detail">📚 {user.program}</p>
                        )}
                        {user.location && (
                          <p className="result-detail">📍 {user.location}</p>
                        )}
                        {user.interests && user.interests.length > 0 && (
                          <p className="result-detail">🎯 {user.interests.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Results */}
            {results.events.length > 0 && (
              <div className="results-section">
                <h4 className="section-title">Events ({results.events.length})</h4>
                <div className="search-results">
                  {results.events.map((event) => (
                    <div 
                      key={event._id} 
                      className="search-result-card"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="result-icon">📅</div>
                      <div className="result-content">
                        <h4 className="result-title">{event.title}</h4>
                        {event.date && (
                          <p className="result-subtitle">
                            📅 {formatDate(event.date)}
                            {event.startTime && ` • ${formatTime(event.startTime)}`}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </p>
                        )}
                        {event.location && (
                          <p className="result-detail">📍 {event.location}</p>
                        )}
                        {event.interests && event.interests.length > 0 && (
                          <p className="result-detail">🎯 {event.interests.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && !loading && (
              <p className="no-results">No results found for "{query}"</p>
            )}
          </>
        ) : (
          <p>Enter a search term to find users and events...</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;