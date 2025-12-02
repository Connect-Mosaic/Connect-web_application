import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "./ChatPage.css";
import { api } from "../apis/client.js";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]); // store list of users
  const [loading, setLoading] = useState(false);

  const activeUser = "You";

  // Fetch the list of users once
  useEffect(() => {
    api
      .get("/api/users") // adjust endpoint to your users API
      .then((data) => {
        // remove the active user from the list
        const otherUsers = data.filter((user) => user !== activeUser);
        setUsers(otherUsers);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);
    api
      .get(`/api/messages?sender=${activeUser}&receiver=${selectedUser}`)
      .then((data) => setMessages(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  // Send a message
  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage = {
      sender: activeUser,
      text: input,
      receiver: selectedUser,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      await api.post("/api/messages", newMessage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <ChatSidebar onSelectUser={setSelectedUser} users={users} />
      </div>

      {/* Main Chat Area */}
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

            {/* Message Input Area */}
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
                disabled={!selectedUser}
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
