import React from "react";
import "./ChatSidebar.css";

function ChatSidebar({ conversations, selectedConversation, onSelectConversation }) {
  return (
    <div className="chat-sidebar-container">
      <h3>Conversations</h3>
      <ul className="conversation-list">
        {conversations.length === 0 ? (
          <li>No conversations yet</li>
        ) : (
          conversations.map((conv) => {
            
            // Pick the correct participant (not active user)
            const participant = conv.members?.find(
              (m) => m._id !== conv.ownerId  // or compare with logged user later
            );

            const isSelected =
              selectedConversation && selectedConversation._id === conv._id;

            return (
              <li
                key={conv._id}
                className={isSelected ? "selected" : ""}
                onClick={() => onSelectConversation(conv)}
              >
                <div className="conversation-item">
                  <span className="participant-name">
                    {participant?.first_name} {participant?.last_name}
                  </span>

                  {conv.latestMessage && (
                    <span className="latest-message">
                      {conv.latestMessage.text.slice(0, 20)}
                      {conv.latestMessage.text.length > 20 ? "..." : ""}
                    </span>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default ChatSidebar;
