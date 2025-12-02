import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import "./ChatPage.css";
import { api } from "../apis/client.js";

function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user from localStorage
  const jwt = localStorage.getItem("jwt");
  const activeUser = jwt ? JSON.parse(jwt).user : null;

  // Fetch conversations
  useEffect(() => {
    if (!activeUser) return;

    api
      .get("/api/conversations", { params: { userId: activeUser._id } })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          console.error("Invalid response format from API:", res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch conversations:", err));
  }, [activeUser]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || !activeUser) return;

    setLoading(true);

    api
      .get(`/api/messages?conversationId=${selectedConversation._id}`)
      .then((res) => {
        if (res.data) {
          setMessages(res.data);
        } else {
          console.error("Invalid messages response:", res);
        }
      })
      .catch((err) => console.error("Failed to fetch messages:", err))
      .finally(() => setLoading(false));
  }, [selectedConversation, activeUser]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !selectedConversation) return;

    const newMessage = {
      sender: activeUser._id,
      conversation: selectedConversation._id,
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
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          activeUser={activeUser}
        />
      </div>

      <div className="chat-main">
        {!selectedConversation ? (
          <div className="chat-window placeholder">
            <h3>Select a conversation to start chatting</h3>
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
                disabled={!input.trim() || !selectedConversation}
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
