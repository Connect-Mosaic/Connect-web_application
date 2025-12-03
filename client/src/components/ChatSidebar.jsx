import React from "react";
import { Link } from "react-router-dom";

// Example static users list; in a real app, you might fetch this from API
const users = [
  { id: "1", name: "User 1" },
  { id: "2", name: "User 2" },
  { id: "3", name: "User 3" },
];

function ChatSidebar() {
  return (
    <div className="chat-sidebar" style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
      <h3>Contacts</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "8px" }}>
            {/* Navigate to /chat/:conversationId */}
            <Link
              to={`/chat/${user.id}`}
              style={{ textDecoration: "none", color: "#333" }}
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatSidebar;
