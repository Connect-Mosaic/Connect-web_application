// components/ChatSidebar.jsx
import React, { useState } from "react";

function NewChatModal({ onClose, onCreateChat }) {
  const [conversationName, setConversationName] = useState("");
  const [participants, setParticipants] = useState(""); // Participants input as comma separated list

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conversationName.trim() || !participants.trim()) {
      alert("Please enter both conversation name and participants.");
      return;
    }

    // Parse participants with trimming
    const parsedParticipants = participants.split(",").map((p) => p.trim()).filter(Boolean);
    if (parsedParticipants.length === 0) {
      alert("Please enter at least one valid participant ID.");
      return;
    }

    // Trigger the API call to create the conversation
    onCreateChat({ name: conversationName.trim(), participants: parsedParticipants });
    setConversationName(""); // Reset form
    setParticipants("");
    onClose(); // Close modal after creating the chat
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Chat</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Conversation Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                  placeholder="Enter a conversation name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Participants (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Enter user IDs, e.g., id1, id2"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to format timestamp to HH:MM AM/PM
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Helper function to get initial for avatar
const getInitial = (displayName) => {
  return displayName ? displayName.charAt(0).toUpperCase() : "?";
};

function ChatSidebar({ conversations, onSelectConversation, onCreateConversation, currentConversationId }) {
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
    // Call the prop function which handles the API (createConversation)
    onCreateConversation(chatDetails);
  };

  return (
    <div className="d-flex flex-column h-100 bg-light p-3">
      {/* Header */}
      <h5 className="mb-3 fw-bold">Chats</h5>

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3 rounded-pill ps-4"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* List of Conversations */}
      <div className="flex-grow-1 overflow-auto mb-3">
        <ul className="list-unstyled mb-0">
          {filteredConversations.length === 0 ? (
            <li className="text-muted p-3">No conversations found</li>
          ) : (
            filteredConversations.map((conv) => {
              const convId = conv?.conversation_id || `temp-${Date.now()}-${Math.random()}`;
              const convName = conv?.display_name || conv?.name || "Unknown";
              const isActive = convId === currentConversationId;
              const initial = getInitial(convName);
              const time = formatTime(conv.last_message_timestamp);
              const hasUnread = conv.unread_count > 0;

              return (
                <li key={convId} className={`p-2 rounded mb-2 cursor-pointer ${isActive ? 'bg-primary-subtle' : 'bg-light'}`} onClick={() => onSelectConversation(convId)}>
                  <div className="d-flex align-items-start">
                    {/* Avatar */}
                    <div className="me-3 position-relative flex-shrink-0">
                      {conv.display_image ? (
                        <img
                          src={conv.display_image}
                          alt={convName}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '40px', height: '40px', display: conv.display_image ? 'none' : 'flex' }}
                      >
                        {initial}
                      </div>
                      {/* Online status dot - assuming online if recent, adjust logic as needed */}
                      <span className="position-absolute bottom-0 end-0 badge rounded-circle bg-success" style={{ width: '10px', height: '10px' }}></span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fw-semibold text-truncate">{convName}</h6>
                        <small className={`text-muted ms-2 ${hasUnread ? 'fw-bold' : ''}`}>{time}</small>
                      </div>
                      <p className="mb-1 small text-muted text-truncate">{conv.last_message || "No messages yet"}</p>
                      {hasUnread && (
                        <span className="badge bg-primary rounded-pill">{conv.unread_count}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Start New Chat Button */}
      <button
        className="btn btn-outline-primary w-100 rounded-pill d-flex align-items-center justify-content-center"
        onClick={handleNewChat}
      >
        <i className="bi bi-plus me-1"></i> Start New Chat
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