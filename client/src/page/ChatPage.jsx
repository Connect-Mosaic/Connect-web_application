import React, { useState, useEffect, useRef } from "react";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import MessageInput from "../components/MessageInput.jsx";  // Import MessageInput
import {
  getMessages,
  sendMessage,
  getUserConversations,
  createConversation, // Import the createConversation function
} from "../apis/conversation";

import "./ChatPage.css";

function ChatPage() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatParticipants, setNewChatParticipants] = useState("");

  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch conversations
  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      try {
        const res = await getUserConversations();
        const convs = Array.isArray(res?.data) ? res.data : [];
        if (isMounted) setConversations(convs);

        if (!conversationId && convs.length > 0) {
          setConversationId(convs[0].conversation_id);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (isMounted) setConversations([]);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(conversationId);
        const fetchedMessages = Array.isArray(res?.data) ? res.data : [];

        const normalizedMessages = fetchedMessages.map((msg) => ({
          ...msg,
          message_id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
          timestamp: msg.timestamp || new Date().toISOString(),
        }));

        if (isMounted) {
          setMessages(normalizedMessages);

          // Build users map
          const senderIds = [
            ...new Set(normalizedMessages.map((m) => m.sender)),
          ];
          const map = {};
          senderIds.forEach((id) => {
            map[id] = usersMap[id] || (id === userId ? "You" : `User ${id}`);
          });
          setUsersMap(map);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (isMounted) setMessages([]);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [conversationId]);

  // Handle sending a message
  const handleSend = async () => {
    const messageContent = input.trim();
    if (!messageContent || !conversationId) return;

    const tempMessage = {
      temp_id: `temp-${Date.now()}-${Math.random()}`,
      sender: userId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      been_read: true,
      edited: false,
      failed: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput(""); // Clear input after sending

    try {
      const res = await sendMessage(conversationId, { content: messageContent });
      const newMessage = res?.data;

      if (newMessage) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp_id === tempMessage.temp_id ? newMessage : msg
          )
        );
        if (!usersMap[newMessage.sender]) {
          setUsersMap((prev) => ({ ...prev, [newMessage.sender]: "You" }));
        }
      } else {
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

  // Handle new chat modal submit
  const handleCreateConversation = async () => {
    const participants = newChatParticipants.split(",").map((p) => p.trim());
    const newConversation = { name: newChatName, participants };

    try {
      const newConversationData = await createConversation(newConversation);
      setConversations((prevConvs) => [newConversationData, ...prevConvs]);
      setShowNewChatModal(false);
      setNewChatName("");
      setNewChatParticipants("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page">
      <ChatSidebar
        conversations={Array.isArray(conversations) ? conversations : []}
        onSelectConversation={setConversationId}
        onNewChatClick={() => setShowNewChatModal(true)} // Open new chat modal
      />

      <div className="chat-main">
        {conversationId ? (
          <>
            <ChatWindow
              messages={Array.isArray(messages) ? messages : []}
              usersMap={usersMap}
              userId={userId}
            />
            <MessageInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
            />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="no-conversation">Please select a conversation to start chatting.</div>
        )}
      </div>

      {showNewChatModal && (
        <div className="new-chat-modal">
          <div className="modal-content">
            <h2>Create New Chat</h2>
            <label>
              Chat Name:
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Enter chat name"
              />
            </label>
            <label>
              Participants (comma separated):
              <input
                type="text"
                value={newChatParticipants}
                onChange={(e) => setNewChatParticipants(e.target.value)}
                placeholder="Enter participant IDs"
              />
            </label>
            <button onClick={handleCreateConversation}>Create Chat</button>
            <button onClick={() => setShowNewChatModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;


