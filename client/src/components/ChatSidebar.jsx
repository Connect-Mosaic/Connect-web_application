import React, { useState } from "react";
import "./ChatSidebar.css";

function ChatSidebar({ onSelectUser, users = [] }) {
  const [search, setSearch] = useState("");

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar-container">
      {/* Search bar */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="sidebar-users">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div
              className="sidebar-user"
              key={index}
              onClick={() => onSelectUser(user)}
            >
              {user}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Start new chat button */}
      <div className="sidebar-footer">
        <button onClick={() => alert("Start new chat clicked!")}>
          Start New Chat
        </button>
      </div>
    </div>
  );
}

export default ChatSidebar;
