// components/ChatSidebar.jsx
import React, { useState } from "react";

/* ======================================================
   FRIENDS MODAL — SIMPLE + CLEAN
====================================================== */
function FriendsModal({ friends, onClose, onSelectFriend }) {
  const normalizedFriends = (Array.isArray(friends) ? friends : []).map((f) => {
    if (typeof f === "string") {
      return {
        _id: f,
        first_name: "Friend",
        last_name: f.slice(-4),
        profile_picture: null,
      };
    }
    return {
      _id: f._id,
      first_name: f.first_name || "Friend",
      last_name: f.last_name || "",
      profile_picture: f.profile_picture || null,
      email: f.email || "",
    };
  });

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Start New Chat</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {normalizedFriends.length === 0 && (
              <p className="text-muted">You have no friends yet.</p>
            )}

            {normalizedFriends.map((f) => (
              <div
                key={f._id}
                className="d-flex align-items-center p-2 border rounded mb-2"
                onClick={() => onSelectFriend(f._id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={f.profile_picture || "/uploads/profile/default.png"}
                  alt=""
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px" }}
                />
                <span>
                  {f.first_name} {f.last_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

/* ======================================================
   NEW: CONVERSATION NAME HELPER
====================================================== */
function getConversationDisplayName(conv, currentUserId) {
  // If backend already provided a name, use it
  if (conv.display_name && conv.display_name.trim() !== "")
    return conv.display_name;

  if (conv.name && conv.name.trim() !== "")
    return conv.name;

  // Otherwise auto-generate for private chats
  if (Array.isArray(conv.participants)) {
    const other = conv.participants.find(
      (p) => p._id !== currentUserId && p.id !== currentUserId
    );

    if (other)
      return `${other.first_name || ""} ${other.last_name || ""}`.trim();
  }

  return "Conversation";
}

/* ======================================================
   MAIN SIDEBAR COMPONENT
====================================================== */
function ChatSidebar({
  conversations,
  onSelectConversation,
  onCreateConversation,
  currentConversationId,
  friends = [],
  currentUserId, // 🔥 MUST BE PASSED FROM ChatPage
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  const filtered = safeConversations.filter((conv) => {
    const name = getConversationDisplayName(conv, currentUserId).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="d-flex flex-column h-100 bg-light p-3 mt-3">
      <h5 className="mb-3 fw-bold">Chats</h5>

      <input
        type="text"
        className="form-control mb-3 rounded-pill ps-4"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex-grow-1 overflow-auto mb-3">
        <ul className="list-unstyled mb-0">
          {filtered.length === 0 ? (
            <li className="text-muted p-3">No conversations found</li>
          ) : (
            filtered.map((conv) => {
              const convId = conv.conversation_id;
              if (!convId) return null;

              const name = getConversationDisplayName(conv, currentUserId);
              const time = formatTime(conv.last_message_timestamp);
              const unread = conv.unread_count > 0;
              const isActive = convId === currentConversationId;

              return (
                <li
                  key={convId}
                  className={`p-2 rounded mb-2 cursor-pointer ${
                    isActive ? "bg-primary-subtle" : "bg-light"
                  } border`}
                  onClick={() => onSelectConversation(convId)}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3 position-relative flex-shrink-0">
                      {conv.display_image ? (
                        <img
                          src={conv.display_image}
                          alt={name}
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {getInitial(name)}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fw-semibold text-truncate">{name}</h6>
                        <small className={`text-muted ms-2 ${unread ? "fw-bold" : ""}`}>
                          {time}
                        </small>
                      </div>

                      <p className="mb-1 small text-muted text-truncate">
                        {conv.last_message || "No messages yet"}
                      </p>

                      {unread && (
                        <span className="badge bg-primary rounded-pill">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <button
        className="btn btn-outline-primary w-100 rounded-pill mt-3"
        onClick={() => setShowFriendsModal(true)}
      >
        <i className="bi bi-plus"></i> Start New Chat
      </button>

      {showFriendsModal && (
        <FriendsModal
          friends={friends}
          onClose={() => setShowFriendsModal(false)}
          onSelectFriend={(friendId) => {
            onCreateConversation({ participant: friendId });
            setShowFriendsModal(false);
          }}
        />
      )}
    </div>
  );
}

export default ChatSidebar;
