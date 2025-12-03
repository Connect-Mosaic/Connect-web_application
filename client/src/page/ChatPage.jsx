import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { api } from "../apis/client";

import "./ChatPage.css";

function ChatPage() {
  const { conversationId: paramId } = useParams();
  const conversationId = paramId || "default_conversation_id";

  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const messagesEndRef = useRef(null);

  if (!conversationId) {
    return (
      <div className="chat-page">
        <div className="chat-sidebar">
          <ChatSidebar />
        </div>
        <div className="chat-main">
          <div className="no-conversation">
            Please select a conversation to start chatting.
          </div>
        </div>
      </div>
    );
  }

  /* --- FETCH MESSAGES & USERS --- */
  useEffect(() => {
    if (!conversationId) return;
    const token = localStorage.getItem("jwt");

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          const fetchedMessages = res.data.map((msg) => ({
            ...msg,
            message_id: msg.message_id || Date.now().toString(),
            timestamp: msg.timestamp || new Date().toISOString(),
          }));

          setMessages(fetchedMessages);

          // fetch unique sender IDs
          const senderIds = [...new Set(fetchedMessages.map((m) => m.sender))];

          const usersRes = await Promise.all(
            senderIds.map((id) =>
              api.get(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );

          const map = {};
          usersRes.forEach((userRes) => {
            if (userRes.success)
              map[userRes.data._id] = userRes.data.first_name || "User";
          });

          setUsersMap(map);
        }
      } catch (err) {
        console.error("LOAD MESSAGES ERROR:", err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  /* --- SEND MESSAGE (Optimistic Update with Fix) --- */
  const handleSend = async () => {
    const messageContent = input.trim(); // capture input before clearing
    if (!messageContent) return;

    const token = localStorage.getItem("jwt");

    const tempMessage = {
      temp_id: Date.now().toString(),
      sender: userId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      been_read: true,
      edited: false,
      failed: false, // track failure
    };

    // Add temporary message to UI
    setMessages((prev) => [...prev, tempMessage]);
    setInput(""); // now safe to clear input

    try {
      const res = await api.post(
        `/api/conversations/${conversationId}/messages`,
        { content: messageContent }, // use captured content
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.success && res.data) {
        // Replace temporary message with server response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp_id === tempMessage.temp_id ? res.data : msg
          )
        );

        if (!usersMap[res.data.sender]) {
          setUsersMap((prev) => ({ ...prev, [res.data.sender]: "You" }));
        }
      } else {
        console.warn("No message returned from API", res);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp_id === tempMessage.temp_id ? { ...msg, failed: true } : msg
          )
        );
      }
    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.temp_id === tempMessage.temp_id ? { ...msg, failed: true } : msg
        )
      );
    }
  };

  /* --- AUTO SCROLL --- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <ChatSidebar />
      </div>

      <div className="chat-main">
        <ChatWindow messages={messages} usersMap={usersMap} userId={userId} />
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
          <button onClick={handleSend} disabled={!input.trim()}>
            Send
          </button>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatPage;
