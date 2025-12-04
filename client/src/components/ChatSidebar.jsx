import React, { useState } from "react";

// Modal to create new chat
function NewChatModal({ onClose, onCreateChat }) {
  const [conversationName, setConversationName] = useState("");
  const [participants, setParticipants] = useState(""); // Participants input as comma separated list

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conversationName || !participants) return; // Validate input

    // Trigger the API call to create the conversation
    onCreateChat({ conversationName, participants: participants.split(",") });
    onClose(); // Close modal after creating the chat
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Chat</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Conversation Name</label>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Enter a conversation name"
              required
            />
          </div>
          <div>
            <label>Participants (comma separated)</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Enter user IDs"
              required
            />
          </div>
          <div>
            <button type="submit">Create Chat</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChatSidebar({ conversations, onSelectConversation, onCreateConversation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false); // State for showing modal

  const safeConversations = Array.isArray(conversations) ? conversations : [];
  
  const filteredConversations = safeConversations.filter((conv) =>
    conv.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle new conversation button click
  const handleNewChat = () => {
    setShowModal(true); // Show modal when "Start New Chat" is clicked
  };

  const handleCreateChat = (chatDetails) => {
    // Assuming onCreateConversation is a function that calls an API to create a new conversation
    onCreateConversation(chatDetails);
  };

  return (
    <div
      className="chat-sidebar"
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>Conversations</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search conversations"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />

      {/* List of Conversations */}
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "10px" }}>
        {filteredConversations.length === 0 ? (
          <li>No conversations found</li>
        ) : (
          filteredConversations.map((conv, index) => {
            const convId =
              conv?.conversation_id || `temp-${Date.now()}-${Math.random()}`;
            const convName =
              conv?.display_name || conv?.name || `Conversation ${index + 1}`;

            return (
              <li key={convId} style={{ marginBottom: "8px" }}>
                <button
                  style={{ all: "unset", cursor: "pointer", color: "#333" }}
                  onClick={() => onSelectConversation(convId)}
                >
                  {convName}
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* Start New Chat Button */}
      <button
        onClick={handleNewChat}
        style={{
          padding: "8px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Start New Chat
      </button>

      {/* Show Modal for New Chat */}
      {showModal && (
        <NewChatModal
          onClose={() => setShowModal(false)} // Close the modal
          onCreateChat={handleCreateChat} // Handle new chat creation
        />
      )}
    </div>
  );
}

export default ChatSidebar;
