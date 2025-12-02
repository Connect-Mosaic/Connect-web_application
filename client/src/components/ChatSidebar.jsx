import React, { useState } from "react";
import "./ChatSidebar.css";

function ChatSidebar({ onSelectUser, users = [], selectedUser, conversations = [] }) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="sidebar-container">
      {/* Search bar */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User list */}
      <div className="sidebar-users">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`sidebar-user ${selectedUser?._id === user._id ? "active" : ""}`}
              onClick={() => onSelectUser(user)}
            >
              {/* Full Name */}
              {user.first_name} {user.last_name}

              {/* Dot if conversation exists */}
              {conversations.some((u) => u._id === user._id) && (
                <span className="has-chat">•</span>
              )}
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={() => alert("Select a user to start a new chat!")}>
          Start New Chat
        </button>
      </div>
    </div>
  );
}

export default ChatSidebar;
