import React, { useRef, useEffect } from "react";
import "./ChatWindow.css";

function ChatWindow({ messages = [], activeUser }) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet. Say hi!</p>
      ) : (
        messages.map((msg, index) => {
          const sender = msg.sender;
          const isSent = sender?._id === activeUser._id;

          const senderName = sender
            ? `${sender.first_name} ${sender.last_name}`
            : "Unknown";

          const avatar = sender?.profile_picture || "/uploads/profile/default.png";

          const date = msg.timestamp ? new Date(msg.timestamp) : null;
          const timeString = date
            ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";

          return (
            <div key={index} className={`chat-message ${isSent ? "sent" : "received"}`}>
              <img src={avatar} alt="avatar" className="chat-avatar" />
              <div className="message-content">
                <p>
                  <strong>{senderName}</strong>: {msg.text}
                </p>
                {timeString && <span className="timestamp">{timeString}</span>}
              </div>
            </div>
          );
        })
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
