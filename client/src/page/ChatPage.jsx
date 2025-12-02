import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "./ChatPage.css";
import { api } from "../apis/client.js";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get logged-in user from localStorage
  const jwt = localStorage.getItem("jwt");
  const activeUser = jwt ? JSON.parse(jwt).user : null; // contains _id, first_name, last_name

  // Fetch all users
  useEffect(() => {
    if (!activeUser) return;

    api
      .get("/api/users") // correct singular route
      .then((res) => {
        if (res && res.data) {
          // exclude the logged-in user
          const filtered = res.data.filter((u) => u._id !== activeUser._id);
          setUsers(filtered);
        } else {
          console.error("Invalid response format from API:", res);
        }
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, [activeUser]);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser || !activeUser) return;

    setLoading(true);

    api
      .get(`/api/messages?sender=${activeUser._id}&receiver=${selectedUser._id}`)
      .then((res) => {
        if (res && res.data) {
          setMessages(res.data);

          // add to conversations if not already there
          setConversations((prev) =>
            prev.find((u) => u._id === selectedUser._id)
              ? prev
              : [...prev, selectedUser]
          );
        } else {
          console.error("Invalid messages response:", res);
        }
      })
      .catch((err) => console.error("Failed to fetch messages:", err))
      .finally(() => setLoading(false));
  }, [selectedUser, activeUser]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage = {
      sender: activeUser._id,
      receiver: selectedUser._id,
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      await api.post("/api/messages", newMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <ChatSidebar
          onSelectUser={setSelectedUser}
          users={users}
          selectedUser={selectedUser}
          conversations={conversations}
        />
      </div>

      <div className="chat-main">
        {!selectedUser ? (
          <div className="chat-window placeholder">
            <h3>Select a user to start chatting</h3>
          </div>
        ) : loading ? (
          <div className="chat-window placeholder">
            <p>Loading messages...</p>
          </div>
        ) : (
          <>
            <ChatWindow messages={messages} activeUser={activeUser} />
            <div className="message-input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !selectedUser}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
