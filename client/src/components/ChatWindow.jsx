// components/ChatWindow.jsx
import React, { useRef, useLayoutEffect } from "react";

function ChatWindow({ messages, usersMap, currentConversation }) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const chatRef = useRef(null); // Ref for the scrollable container

  // Auto-scroll to bottom when messages change
  useLayoutEffect(() => {
    if (chatRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 0);
    }
  }, [messages]);

  if (safeMessages.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-muted">
        No messages yet
      </div>
    );
  }

  // Helper to format timestamp
  const formatTimestamp = (timestamp, showSeen = false, beenRead = false) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const seenStr = showSeen ? beenRead ? " • Seen" : "" : "";
    return `${timeStr}${seenStr}`;
  };

  return (
    <div
      ref={chatRef}
      className="d-flex flex-column h-100 p-2 overflow-auto chat-window"
      style={{ backgroundColor: '#e3f2fd' }}
    >
      {/* Chat Header - Only show if currentConversation provided */}
      {currentConversation && (
        <div className="d-flex align-items-center p-2 border-bottom bg-white rounded mb-2 mt-1">
          <div className="position-relative me-2 flex-shrink-0">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
              {currentConversation.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="position-absolute bottom-0 end-0 badge rounded-circle bg-success" style={{ width: '10px', height: '10px' }}></span>
          </div>
          <div>
            <h6 className="mb-1 small">{currentConversation.display_name || "Chat"}</h6>
            <small className="text-muted">Online | Computer Science</small>
          </div>
        </div>
      )}

      {safeMessages.map((msg, index) => {
        // Unique key: server message_id > temp_id > fallback
        const key = msg.message_id || msg.temp_id || `msg-${Date.now()}-${Math.random()}-${index}`;

        const isOwnMessage = msg.sender === msg.login_user_id;
        const senderName = usersMap[msg.sender] || (isOwnMessage ? "You" : `User ${msg.sender.slice(-4)}`);
        const showSeen = isOwnMessage && msg.been_read;
        const beenRead = msg.been_read;


        return (
          <div
            key={key}
            className={`mb-2 d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"} mt-1`}
          >
            <div
              className={`p-3 rounded-pill position-relative ${isOwnMessage ? "bg-primary text-white" : "bg-white border shadow-sm"}`}
              style={{
                maxWidth: "70%",
                wordWrap: "break-word",
                boxShadow: isOwnMessage ? "none" : "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <div className="small fw-medium">{msg.content}</div>
              <div className={`mt-1 small opacity-75 text-end ${isOwnMessage ? "" : "text-start"}`}>
                {formatTimestamp(msg.timestamp, showSeen, beenRead)}
                {msg.edited && <span className="ms-1">(edited)</span>}
                {msg.failed && <span className="text-danger ms-1">(failed)</span>}
                {msg.sent && <span className="ms-1">✓</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatWindow;