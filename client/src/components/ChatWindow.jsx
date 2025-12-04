import React from "react";

function ChatWindow({ messages, usersMap, userId }) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="chat-window" style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {safeMessages.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#999" }}>
          No messages yet
        </div>
      )}

      {safeMessages.map((msg, index) => {
        // Unique key: server message_id > temp_id > fallback
        const key = msg.message_id || msg.temp_id || `msg-${Date.now()}-${Math.random()}-${index}`;

        const senderName = usersMap[msg.sender] || (msg.sender === userId ? "You" : `User ${msg.sender}`);

        return (
          <div
            key={key}
            className={`message ${msg.sender === userId ? "own-message" : "other-message"}`}
            style={{
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: msg.sender === userId ? "#DCF8C6" : "#F1F0F0",
              alignSelf: msg.sender === userId ? "flex-end" : "flex-start",
              maxWidth: "70%",
            }}
          >
            <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>
              {senderName}
            </div>
            <div>{msg.content}</div>
            {msg.edited && <div style={{ fontSize: "10px", color: "#999" }}>(edited)</div>}
            {msg.failed && <div style={{ fontSize: "10px", color: "red" }}>(failed)</div>}
          </div>
        );
      })}
    </div>
  );
}

export default ChatWindow;
