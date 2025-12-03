import React, { useRef, useEffect } from "react";

function ChatWindow({ messages, usersMap, userId, onRetry }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="chat-window"
      style={{ flex: 1, padding: "10px", overflowY: "auto", height: "400px" }}
    >
      {messages.map((msg) => {
        const isSentByUser = msg.sender === userId;
        const isFailed = msg.failed;

        return (
          <div
            key={msg.message_id || msg.temp_id}
            className={`chat-message ${isSentByUser ? "sent" : "received"}`}
            style={{
              marginBottom: "8px",
              padding: "5px",
              backgroundColor: isFailed ? "#f8d7da" : isSentByUser ? "#dcf8c6" : "#fff",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>{isSentByUser ? "You" : usersMap[msg.sender] || "User"}:</strong>{" "}
              {msg.content}
              <span
                style={{ float: "right", fontSize: "0.7em", color: "#555" }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>

            {/* Retry button for failed messages */}
            {isFailed && isSentByUser && (
              <button
                style={{
                  position: "absolute",
                  right: "5px",
                  bottom: "-20px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                onClick={() => onRetry(msg)}
              >
                Retry
              </button>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
