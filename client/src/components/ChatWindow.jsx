import React, { useRef, useEffect } from "react";
import "./ChatWindow.css"; 

function ChatWindow({ messages = [], activeUser }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet. Say hi!</p>
      ) : (
        messages.map((msg, index) => {
          const isSent = msg.sender === activeUser;
          const date = msg.timestamp ? new Date(msg.timestamp) : null;
          const timeString = date
            ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";

          return (
            <div
              key={index}
              className={`chat-message ${isSent ? "sent" : "received"}`}
            >
              <div className="message-content">
                <p>
                  <strong>{msg.sender}</strong>: {msg.text}
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
